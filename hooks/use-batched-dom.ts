"use client"

import * as React from "react"
import { animationBudget } from "../lib/animation-frame-budget"

interface DOMOperation {
  id: string
  type: 'read' | 'write'
  fn: () => void
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface BatchedDOMReturn {
  scheduleRead: (id: string, fn: () => void, priority?: DOMOperation['priority']) => void
  scheduleWrite: (id: string, fn: () => void, priority?: DOMOperation['priority']) => void
  scheduleReadWrite: (
    readId: string, 
    readFn: () => void, 
    writeId: string, 
    writeFn: () => void, 
    priority?: DOMOperation['priority']
  ) => void
  flush: () => void
  cancel: (id: string) => void
}

/**
 * Hook for batching DOM read and write operations to prevent layout thrashing
 * 
 * Follows the pattern:
 * 1. Batch all DOM reads first
 * 2. Then batch all DOM writes
 * 3. Execute in requestAnimationFrame for optimal timing
 * 
 * @example
 * ```tsx
 * const domBatch = useBatchedDOM()
 * 
 * // Schedule DOM reads first
 * domBatch.scheduleRead('measure-element', () => {
 *   const rect = element.getBoundingClientRect()
 *   setMeasurements(rect)
 * })
 * 
 * // Schedule DOM writes after reads
 * domBatch.scheduleWrite('update-styles', () => {
 *   element.style.transform = `translateX(${offset}px)`
 * })
 * ```
 */
export function useBatchedDOM(): BatchedDOMReturn {
  const readOperations = React.useRef(new Map<string, DOMOperation>())
  const writeOperations = React.useRef(new Map<string, DOMOperation>())
  const isScheduled = React.useRef(false)

  const processBatch = React.useCallback(() => {
    if (!isScheduled.current) return
    
    const reads = Array.from(readOperations.current.values())
    const writes = Array.from(writeOperations.current.values())
    
    // Sort by priority (critical first)
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    const sortByPriority = (a: DOMOperation, b: DOMOperation) => 
      priorityOrder[b.priority] - priorityOrder[a.priority]
    
    reads.sort(sortByPriority)
    writes.sort(sortByPriority)
    
    // Use animation budget for scheduling
    const batchId = `dom-batch-${Date.now()}`
    
    animationBudget.schedule(batchId, () => {
      // Execute all reads first (measure)
      reads.forEach(operation => {
        try {
          operation.fn()
        } catch (error) {
          console.warn(`DOM read operation failed: ${operation.id}`, error)
        }
      })
      
      // Then execute all writes (mutate)
      writes.forEach(operation => {
        try {
          operation.fn()
        } catch (error) {
          console.warn(`DOM write operation failed: ${operation.id}`, error)
        }
      })
      
      // Clear operations and reset state
      readOperations.current.clear()
      writeOperations.current.clear()
      isScheduled.current = false
    }, 'high', 8) // High priority, ~8ms estimated
  }, [])

  const scheduleBatch = React.useCallback(() => {
    if (!isScheduled.current) {
      isScheduled.current = true
      // Schedule for next frame
      requestAnimationFrame(processBatch)
    }
  }, [processBatch])

  const scheduleRead = React.useCallback((
    id: string, 
    fn: () => void, 
    priority: DOMOperation['priority'] = 'medium'
  ) => {
    readOperations.current.set(id, { id, type: 'read', fn, priority })
    scheduleBatch()
  }, [scheduleBatch])

  const scheduleWrite = React.useCallback((
    id: string, 
    fn: () => void, 
    priority: DOMOperation['priority'] = 'medium'
  ) => {
    writeOperations.current.set(id, { id, type: 'write', fn, priority })
    scheduleBatch()
  }, [scheduleBatch])

  const scheduleReadWrite = React.useCallback((
    readId: string,
    readFn: () => void,
    writeId: string,
    writeFn: () => void,
    priority: DOMOperation['priority'] = 'medium'
  ) => {
    readOperations.current.set(readId, { id: readId, type: 'read', fn: readFn, priority })
    writeOperations.current.set(writeId, { id: writeId, type: 'write', fn: writeFn, priority })
    scheduleBatch()
  }, [scheduleBatch])

  const flush = React.useCallback(() => {
    if (isScheduled.current) {
      processBatch()
    }
  }, [processBatch])

  const cancel = React.useCallback((id: string) => {
    readOperations.current.delete(id)
    writeOperations.current.delete(id)
  }, [])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      readOperations.current.clear()
      writeOperations.current.clear()
      isScheduled.current = false
    }
  }, [])

  return {
    scheduleRead,
    scheduleWrite,
    scheduleReadWrite,
    flush,
    cancel
  }
}

/**
 * Hook for efficiently managing element measurements
 * Batches getBoundingClientRect calls to prevent layout thrashing
 */
export function useBatchedMeasurements() {
  const domBatch = useBatchedDOM()
  const measurements = React.useRef(new Map<HTMLElement, DOMRect>())

  const measureElement = React.useCallback((
    element: HTMLElement,
    callback: (rect: DOMRect) => void,
    priority: DOMOperation['priority'] = 'medium'
  ) => {
    const id = `measure-${element.dataset.measureId || Math.random().toString(36)}`
    
    domBatch.scheduleRead(id, () => {
      const rect = element.getBoundingClientRect()
      measurements.current.set(element, rect)
      callback(rect)
    }, priority)
  }, [domBatch])

  const measureElements = React.useCallback((
    elements: HTMLElement[],
    callback: (measurements: Map<HTMLElement, DOMRect>) => void,
    priority: DOMOperation['priority'] = 'medium'
  ) => {
    const id = `measure-batch-${Date.now()}`
    
    domBatch.scheduleRead(id, () => {
      const newMeasurements = new Map<HTMLElement, DOMRect>()
      
      elements.forEach(element => {
        const rect = element.getBoundingClientRect()
        newMeasurements.set(element, rect)
        measurements.current.set(element, rect)
      })
      
      callback(newMeasurements)
    }, priority)
  }, [domBatch])

  const getCachedMeasurement = React.useCallback((element: HTMLElement) => {
    return measurements.current.get(element)
  }, [])

  return {
    measureElement,
    measureElements,
    getCachedMeasurement,
    scheduleRead: domBatch.scheduleRead,
    scheduleWrite: domBatch.scheduleWrite,
    scheduleReadWrite: domBatch.scheduleReadWrite,
    flush: domBatch.flush
  }
}

/**
 * Hook for batched style updates to prevent style recalculation thrashing
 */
export function useBatchedStyles() {
  const domBatch = useBatchedDOM()

  const updateStyles = React.useCallback((
    element: HTMLElement,
    styles: Partial<CSSStyleDeclaration>,
    priority: DOMOperation['priority'] = 'medium'
  ) => {
    const id = `styles-${element.dataset.styleId || Math.random().toString(36)}`
    
    domBatch.scheduleWrite(id, () => {
      Object.assign(element.style, styles)
    }, priority)
  }, [domBatch])

  const updateMultipleStyles = React.useCallback((
    updates: Array<{ element: HTMLElement; styles: Partial<CSSStyleDeclaration> }>,
    priority: DOMOperation['priority'] = 'medium'
  ) => {
    const id = `styles-batch-${Date.now()}`
    
    domBatch.scheduleWrite(id, () => {
      updates.forEach(({ element, styles }) => {
        Object.assign(element.style, styles)
      })
    }, priority)
  }, [domBatch])

  const updateTransform = React.useCallback((
    element: HTMLElement,
    transform: string,
    priority: DOMOperation['priority'] = 'high'
  ) => {
    const id = `transform-${element.dataset.transformId || Math.random().toString(36)}`
    
    domBatch.scheduleWrite(id, () => {
      element.style.transform = transform
    }, priority)
  }, [domBatch])

  return {
    updateStyles,
    updateMultipleStyles,
    updateTransform,
    scheduleRead: domBatch.scheduleRead,
    scheduleWrite: domBatch.scheduleWrite,
    flush: domBatch.flush
  }
}

// Export types
export type { DOMOperation, BatchedDOMReturn }