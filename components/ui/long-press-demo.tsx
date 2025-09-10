"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { GestureWrapper, SimpleGestureWrapper } from "./gesture-wrapper"
import { useTouchFeedback } from "./touch-feedback"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { Copy, Heart, Share, MoreHorizontal, Star, Download, Edit, Trash2 } from "lucide-react"
import { toast } from "./use-toast"

/**
 * Demo component showcasing long-press and touch interactions
 * Demonstrates various use cases and configurations
 */
const LongPressDemoComponent: React.FC = () => {
  const [hearts, setHearts] = React.useState(0)
  const [copied, setCopied] = React.useState(false)
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())

  const handleLike = React.useCallback(() => {
    setHearts(prev => prev + 1)
    toast({
      title: "Liked!",
      description: "Added to your favorites",
      duration: 2000
    })
  }, [])

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText("Long press functionality demo")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
      duration: 2000
    })
  }, [])

  const handleShare = React.useCallback(() => {
    toast({
      title: "Share Menu",
      description: "Share options would appear here",
      duration: 2000
    })
  }, [])

  const toggleSelection = React.useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const contextMenuItems = [
    {
      label: "Edit",
      icon: <Edit size={16} />,
      action: () => toast({ title: "Edit", description: "Edit action triggered" })
    },
    {
      label: "Copy",
      icon: <Copy size={16} />,
      action: handleCopy
    },
    {
      label: "Share",
      icon: <Share size={16} />,
      action: handleShare
    },
    {
      label: "Delete",
      icon: <Trash2 size={16} />,
      action: () => toast({ title: "Delete", description: "Delete action triggered", variant: "destructive" })
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Long Press & Touch Demo</h1>
        <p className="text-muted-foreground">
          Try long pressing on the elements below to see different interactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Long Press */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Long Press</CardTitle>
            <CardDescription>
              Long press to like this post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleGestureWrapper
              onLongPress={handleLike}
              duration={800}
              className="relative"
            >
              <div className="p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Heart className={cn(
                  "mx-auto mb-2 h-8 w-8 transition-colors",
                  hearts > 0 ? "text-red-500 fill-red-500" : "text-muted-foreground"
                )} />
                <p className="text-sm text-muted-foreground">Long press to like</p>
                {hearts > 0 && (
                  <Badge variant="secondary" className="mt-2">
                    {hearts} {hearts === 1 ? 'like' : 'likes'}
                  </Badge>
                )}
              </div>
            </SimpleGestureWrapper>
          </CardContent>
        </Card>

        {/* Copy to Clipboard */}
        <Card>
          <CardHeader>
            <CardTitle>Copy Action</CardTitle>
            <CardDescription>
              Long press to copy text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GestureWrapper
              longPress={{
                enabled: true,
                handlers: {
                  onLongPress: handleCopy
                },
                options: {
                  duration: 600
                }
              }}
              feedback={{
                enabled: true,
                variant: "ring",
                showProgress: true,
                color: "primary"
              }}
            >
              <div className="p-4 bg-muted rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-colors">
                <Copy className={cn(
                  "mx-auto mb-2 h-6 w-6 transition-colors",
                  copied ? "text-green-500" : "text-muted-foreground"
                )} />
                <p className="text-sm">
                  {copied ? "Copied!" : "Long press to copy"}
                </p>
                <code className="text-xs text-muted-foreground block mt-1">
                  "Long press functionality demo"
                </code>
              </div>
            </GestureWrapper>
          </CardContent>
        </Card>

        {/* Context Menu */}
        <Card>
          <CardHeader>
            <CardTitle>Context Menu</CardTitle>
            <CardDescription>
              Long press for context menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GestureWrapper
              contextMenuItems={contextMenuItems}
              longPress={{
                enabled: true,
                options: {
                  duration: 500
                }
              }}
              feedback={{
                enabled: true,
                variant: "pulse",
                showProgress: true
              }}
            >
              <div className="p-4 border rounded-lg text-center cursor-pointer hover:bg-muted/50 transition-colors">
                <MoreHorizontal className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Long press for menu
                </p>
              </div>
            </GestureWrapper>
          </CardContent>
        </Card>

        {/* Selection Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Selection Mode</CardTitle>
            <CardDescription>
              Long press to select items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['item-1', 'item-2', 'item-3'].map((id, index) => (
                <SimpleGestureWrapper
                  key={id}
                  onLongPress={() => toggleSelection(id)}
                  duration={400}
                >
                  <div className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-colors",
                    selectedItems.has(id) 
                      ? "border-primary bg-primary/10" 
                      : "border-muted hover:border-muted-foreground/50"
                  )}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Item {index + 1}</span>
                      {selectedItems.has(id) && (
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                </SimpleGestureWrapper>
              ))}
              {selectedItems.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems(new Set())}
                  className="w-full"
                >
                  Clear Selection ({selectedItems.size})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Download Progress */}
        <DownloadDemo />

        {/* Rating Component */}
        <RatingDemo />
      </div>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>
                <strong>Basic Long Press:</strong> Hold down for 800ms to trigger the like action
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>
                <strong>Copy Action:</strong> Long press for 600ms with ring progress indicator
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>
                <strong>Context Menu:</strong> Long press for 500ms to show context menu options
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>
                <strong>Selection:</strong> Quick long press (400ms) to toggle item selection
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Download progress demo component
 */
const DownloadDemo: React.FC = () => {
  const [isDownloading, setIsDownloading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const touchFeedback = useTouchFeedback({ duration: 2000 })

  const startDownload = React.useCallback(() => {
    setIsDownloading(true)
    setProgress(0)
    touchFeedback.trigger()

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsDownloading(false)
          touchFeedback.cancel()
          toast({
            title: "Download Complete",
            description: "File downloaded successfully!"
          })
          return 100
        }
        return prev + 2
      })
    }, 40)
  }, [touchFeedback])

  React.useEffect(() => {
    if (touchFeedback.progress > 0) {
      const simulatedProgress = touchFeedback.progress * 100
      setProgress(simulatedProgress)
    }
  }, [touchFeedback.progress])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Progress</CardTitle>
        <CardDescription>
          Long press to start download
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SimpleGestureWrapper
          onLongPress={startDownload}
          duration={2000}
          feedback={{
            enabled: true,
            variant: "gradient",
            showProgress: true
          }}
        >
          <div className="p-4 border rounded-lg text-center cursor-pointer hover:bg-muted/50 transition-colors">
            <Download className={cn(
              "mx-auto mb-2 h-6 w-6 transition-colors",
              isDownloading ? "text-primary animate-pulse" : "text-muted-foreground"
            )} />
            <p className="text-sm">
              {isDownloading ? `Downloading... ${progress.toFixed(0)}%` : "Long press to download"}
            </p>
            {(isDownloading || touchFeedback.isActive) && (
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-100"
                  style={{ width: `${touchFeedback.isActive ? touchFeedback.progress * 100 : progress}%` }}
                />
              </div>
            )}
          </div>
        </SimpleGestureWrapper>
      </CardContent>
    </Card>
  )
}

/**
 * Rating component demo
 */
const RatingDemo: React.FC = () => {
  const [rating, setRating] = React.useState(0)
  const [hoveredRating, setHoveredRating] = React.useState(0)

  const handleRating = React.useCallback((value: number) => {
    setRating(value)
    toast({
      title: "Rating Set",
      description: `You rated this ${value} star${value === 1 ? '' : 's'}!`,
      duration: 2000
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Star Rating</CardTitle>
        <CardDescription>
          Long press stars to rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <SimpleGestureWrapper
              key={star}
              onLongPress={() => handleRating(star)}
              duration={300}
            >
              <div
                className="cursor-pointer p-1"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    star <= (hoveredRating || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  )}
                />
              </div>
            </SimpleGestureWrapper>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {rating > 0 ? `Rated ${rating}/5 stars` : "Long press to rate"}
        </p>
      </CardContent>
    </Card>
  )
}

export const LongPressDemo = LongPressDemoComponent