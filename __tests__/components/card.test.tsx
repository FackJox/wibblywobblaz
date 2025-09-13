import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Card, CardTitle, CardHeader, CardContent, CardFooter, CardDescription } from '@/components/ui/card'

// Mock the hover hooks
jest.mock('@/hooks/use-magnetic-hover', () => ({
  useMagneticHover: jest.fn(() => ({
    ref: { current: null },
    transform: { x: 0, y: 0 },
    isHovered: false,
    isActive: true,
    triggerMagnetic: jest.fn(),
    reset: jest.fn()
  }))
}))

jest.mock('@/hooks/use-gradient-follow', () => ({
  useGradientFollow: jest.fn(() => ({
    ref: { current: null },
    cursorPosition: { x: 0, y: 0 },
    gradientValue: '',
    isHovered: false,
    isActive: false,
    setCursorPosition: jest.fn(),
    reset: jest.fn()
  }))
}))

jest.mock('@/hooks/use-text-reveal', () => ({
  useTextReveal: jest.fn(() => ({
    ref: { current: null },
    spans: [],
    isRevealed: false,
    isActive: true,
    isHovered: false,
    reveal: jest.fn(),
    hide: jest.fn(),
    reset: jest.fn(),
    toggle: jest.fn()
  }))
}))

jest.mock('@/hooks/use-ripple', () => ({
  useRipple: jest.fn(() => ({
    rippleRef: { current: null },
    isActive: false,
    triggerRipple: jest.fn(),
    getRippleProps: jest.fn(() => ({}))
  }))
}))

// Mock performance and reduced motion
const mockMatchMedia = jest.fn()
global.matchMedia = mockMatchMedia

describe('Card Components', () => {
  beforeEach(() => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }))
    jest.clearAllMocks()
  })

  describe('Card', () => {
    it('should render basic card', () => {
      render(<Card data-testid="card">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('Card content')
    })

    it('should apply interactive styling', () => {
      render(<Card interactive data-testid="card">Interactive card</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('cursor-pointer')
      expect(card).toHaveClass('transition-all')
    })

    it('should enable magnetic hover when specified', () => {
      render(<Card magnetic data-testid="card">Magnetic card</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('will-change-transform')
    })

    it('should enable gradient follow when specified', () => {
      render(<Card gradientFollow data-testid="card">Gradient card</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
    })

    it('should enable parallax when specified', () => {
      render(<Card parallax data-testid="card">Parallax card</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('will-change-transform')
    })

    it('should enable all enhanced hover effects', () => {
      render(<Card enhancedHover data-testid="card">Enhanced card</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('hover:shadow-lg')
      expect(card).toHaveClass('will-change-transform')
    })

    it('should handle click events', () => {
      const onClick = jest.fn()
      render(<Card onClick={onClick} data-testid="card">Clickable card</Card>)
      
      const card = screen.getByTestId('card')
      fireEvent.click(card)
      
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should handle mouse events for parallax', () => {
      render(<Card parallax data-testid="card">Parallax card</Card>)
      
      const card = screen.getByTestId('card')
      
      // Should not throw on mouse events
      fireEvent.mouseMove(card, { clientX: 50, clientY: 50 })
      fireEvent.mouseLeave(card)
      
      expect(card).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      render(<Card className="custom-class" data-testid="card">Custom card</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
      expect(card).toHaveClass('rounded-lg') // Default class should still be there
    })
  })

  describe('CardTitle', () => {
    it('should render basic title', () => {
      render(<CardTitle data-testid="title">Card Title</CardTitle>)
      
      const title = screen.getByTestId('title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Card Title')
    })

    it('should enable text reveal when specified', () => {
      render(<CardTitle textReveal data-testid="title">Reveal Title</CardTitle>)
      
      const title = screen.getByTestId('title')
      expect(title).toHaveClass('cursor-pointer')
    })

    it('should apply custom className', () => {
      render(<CardTitle className="custom-title" data-testid="title">Custom Title</CardTitle>)
      
      const title = screen.getByTestId('title')
      expect(title).toHaveClass('custom-title')
      expect(title).toHaveClass('text-2xl') // Default class should still be there
    })
  })

  describe('CardHeader', () => {
    it('should render header content', () => {
      render(<CardHeader data-testid="header">Header content</CardHeader>)
      
      const header = screen.getByTestId('header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('Header content')
    })

    it('should apply default spacing classes', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>)
      
      const header = screen.getByTestId('header')
      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
      expect(header).toHaveClass('space-y-1.5')
      expect(header).toHaveClass('p-6')
    })
  })

  describe('CardContent', () => {
    it('should render content', () => {
      render(<CardContent data-testid="content">Card content</CardContent>)
      
      const content = screen.getByTestId('content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveTextContent('Card content')
    })

    it('should apply default padding classes', () => {
      render(<CardContent data-testid="content">Content</CardContent>)
      
      const content = screen.getByTestId('content')
      expect(content).toHaveClass('p-6')
      expect(content).toHaveClass('pt-0')
    })
  })

  describe('CardFooter', () => {
    it('should render footer content', () => {
      render(<CardFooter data-testid="footer">Footer content</CardFooter>)
      
      const footer = screen.getByTestId('footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveTextContent('Footer content')
    })

    it('should apply default flex classes', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>)
      
      const footer = screen.getByTestId('footer')
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('items-center')
      expect(footer).toHaveClass('p-6')
      expect(footer).toHaveClass('pt-0')
    })
  })

  describe('CardDescription', () => {
    it('should render description', () => {
      render(<CardDescription data-testid="description">Card description</CardDescription>)
      
      const description = screen.getByTestId('description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent('Card description')
    })

    it('should apply muted text classes', () => {
      render(<CardDescription data-testid="description">Description</CardDescription>)
      
      const description = screen.getByTestId('description')
      expect(description).toHaveClass('text-sm')
      expect(description).toHaveClass('text-muted-foreground')
    })
  })

  describe('Complete Card Example', () => {
    it('should render full card with all components', () => {
      render(
        <Card enhancedHover data-testid="complete-card">
          <CardHeader>
            <CardTitle textReveal>Enhanced Card Title</CardTitle>
            <CardDescription>This card has all the hover enhancements</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the card content with enhanced hover effects.</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      )
      
      const card = screen.getByTestId('complete-card')
      const title = screen.getByText('Enhanced Card Title')
      const description = screen.getByText('This card has all the hover enhancements')
      const content = screen.getByText('This is the card content with enhanced hover effects.')
      const button = screen.getByText('Action Button')
      
      expect(card).toBeInTheDocument()
      expect(title).toBeInTheDocument()
      expect(description).toBeInTheDocument()
      expect(content).toBeInTheDocument()
      expect(button).toBeInTheDocument()
      
      // Check enhanced hover classes
      expect(card).toHaveClass('hover:shadow-lg')
      expect(card).toHaveClass('will-change-transform')
      expect(title).toHaveClass('cursor-pointer')
    })
  })
})