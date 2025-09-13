"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Info, AlertTriangle, User, Bell } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function TestFeedbackDisplayPage() {
  const [progressValue, setProgressValue] = useState(33)
  const { toast } = useToast()

  const showToast = (variant: "default" | "destructive" | "success" | "warning" | "info") => {
    toast({
      variant,
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
      description: `This is a ${variant} toast notification with some example content.`,
      action: variant === "destructive" ? undefined : <Button variant="outline" size="sm">Action</Button>
    })
  }

  const incrementProgress = () => {
    setProgressValue(prev => Math.min(prev + 20, 100))
  }

  const resetProgress = () => {
    setProgressValue(0)
  }

  const randomizeAll = () => {
    setProgressValue(Math.floor(Math.random() * 100))
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Feedback & Display Components Test</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive showcase of Alert, Badge, Progress, Avatar, Separator, and Toast components with PandaCSS
          </p>
        </div>

        <div className="flex gap-4">
          <Button onClick={randomizeAll}>Randomize All</Button>
          <Button onClick={incrementProgress} variant="outline">Add Progress</Button>
          <Button onClick={resetProgress} variant="outline">Reset Progress</Button>
        </div>

        {/* Alert Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Alert Components</h2>
          
          <div className="grid gap-4">
            <Alert variant="default" size="md">
              <Info className="h-4 w-4" />
              <AlertTitle size="md">Default Alert</AlertTitle>
              <AlertDescription size="md">
                This is a default alert with an information icon. It provides general information to users.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive" size="md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle size="md">Destructive Alert</AlertTitle>
              <AlertDescription size="md">
                This is a destructive alert indicating an error or critical issue that needs attention.
              </AlertDescription>
            </Alert>

            <Alert variant="warning" size="md">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle size="md">Warning Alert</AlertTitle>
              <AlertDescription size="md">
                This is a warning alert that notifies users of potential issues or important notes.
              </AlertDescription>
            </Alert>

            <Alert variant="success" size="md">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle size="md">Success Alert</AlertTitle>
              <AlertDescription size="md">
                This is a success alert confirming that an action has been completed successfully.
              </AlertDescription>
            </Alert>

            <Alert variant="info" size="md">
              <Info className="h-4 w-4" />
              <AlertTitle size="md">Info Alert</AlertTitle>
              <AlertDescription size="md">
                This is an informational alert providing helpful context or guidance.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Alert variant="default" size="sm">
              <Info className="h-4 w-4" />
              <AlertTitle size="sm">Small Alert</AlertTitle>
              <AlertDescription size="sm">Compact alert with small text.</AlertDescription>
            </Alert>

            <Alert variant="default" size="md">
              <Info className="h-4 w-4" />
              <AlertTitle size="md">Medium Alert</AlertTitle>
              <AlertDescription size="md">Standard sized alert with medium text.</AlertDescription>
            </Alert>

            <Alert variant="default" size="lg">
              <Info className="h-4 w-4" />
              <AlertTitle size="lg">Large Alert</AlertTitle>
              <AlertDescription size="lg">Spacious alert with large text.</AlertDescription>
            </Alert>
          </div>
        </section>

        <Separator />

        {/* Badge Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Badge Components</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Badge Variants</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Badge Sizes</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" size="sm">Small</Badge>
                <Badge variant="default" size="md">Medium</Badge>
                <Badge variant="default" size="lg">Large</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Contextual Badges</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" size="sm">Online</Badge>
                <Badge variant="warning" size="sm">Pending</Badge>
                <Badge variant="destructive" size="sm">Offline</Badge>
                <Badge variant="info" size="sm">New</Badge>
                <Badge variant="outline" size="sm">Free</Badge>
                <Badge variant="secondary" size="sm">Premium</Badge>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Progress Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Progress Components</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Progress Variants & Sizes</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Default Progress (Small)</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} variant="default" size="sm" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Default Progress (Medium)</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} variant="default" size="md" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Default Progress (Large)</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} variant="default" size="lg" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} variant="default" indicatorVariant="success" size="md" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Warning Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} variant="default" indicatorVariant="warning" size="md" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} variant="default" indicatorVariant="error" size="md" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Animated Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} animated size="md" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Avatar Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Avatar Components</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Avatar Sizes</h3>
              <div className="flex items-end gap-4">
                <div className="text-center space-y-2">
                  <Avatar size="xs">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                    <AvatarFallback size="xs">XS</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">XS</span>
                </div>
                <div className="text-center space-y-2">
                  <Avatar size="sm">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                    <AvatarFallback size="sm">SM</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">SM</span>
                </div>
                <div className="text-center space-y-2">
                  <Avatar size="md">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                    <AvatarFallback size="md">MD</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">MD</span>
                </div>
                <div className="text-center space-y-2">
                  <Avatar size="lg">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" />
                    <AvatarFallback size="lg">LG</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">LG</span>
                </div>
                <div className="text-center space-y-2">
                  <Avatar size="xl">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" />
                    <AvatarFallback size="xl">XL</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">XL</span>
                </div>
                <div className="text-center space-y-2">
                  <Avatar size="2xl">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" />
                    <AvatarFallback size="2xl">2XL</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">2XL</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Avatar Shapes</h3>
              <div className="flex items-center gap-4">
                <div className="text-center space-y-2">
                  <Avatar size="lg" shape="circle">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b95c?w=48&h=48&fit=crop&crop=face" />
                    <AvatarFallback size="lg">C</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">Circle</span>
                </div>
                <div className="text-center space-y-2">
                  <Avatar size="lg" shape="square">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b95c?w=48&h=48&fit=crop&crop=face" />
                    <AvatarFallback size="lg">S</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">Square</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Avatar with Fallbacks</h3>
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarImage src="https://invalid-url.jpg" />
                  <AvatarFallback size="lg">JD</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarImage src="https://invalid-url.jpg" />
                  <AvatarFallback size="lg"><User className="h-6 w-6" /></AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarImage src="https://invalid-url.jpg" />
                  <AvatarFallback size="lg">AB</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Separator Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Separator Components</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Horizontal Separators</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Small spacing</p>
                  <Separator orientation="horizontal" size="sm" />
                  <p className="text-sm text-muted-foreground mt-2">Content after separator</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Medium spacing (default)</p>
                  <Separator orientation="horizontal" size="md" />
                  <p className="text-sm text-muted-foreground mt-4">Content after separator</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-6">Large spacing</p>
                  <Separator orientation="horizontal" size="lg" />
                  <p className="text-sm text-muted-foreground mt-6">Content after separator</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Vertical Separators</h3>
              <div className="flex items-center h-16">
                <span className="text-sm">Item 1</span>
                <Separator orientation="vertical" size="sm" />
                <span className="text-sm">Item 2</span>
                <Separator orientation="vertical" size="md" />
                <span className="text-sm">Item 3</span>
                <Separator orientation="vertical" size="lg" />
                <span className="text-sm">Item 4</span>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Toast Components */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Toast Components</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button onClick={() => showToast("default")} variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                Default Toast
              </Button>
              <Button onClick={() => showToast("destructive")} variant="destructive">
                <AlertCircle className="mr-2 h-4 w-4" />
                Error Toast
              </Button>
              <Button onClick={() => showToast("success")} variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                Success Toast
              </Button>
              <Button onClick={() => showToast("warning")} variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Warning Toast
              </Button>
              <Button onClick={() => showToast("info")} variant="outline">
                <Info className="mr-2 h-4 w-4" />
                Info Toast
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Click the buttons above to trigger toast notifications. Each toast type has its own styling and behavior.
            </p>
          </div>
        </section>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground text-center">
            All components are now using PandaCSS recipes with enhanced variant support and consistent theming.
          </p>
        </div>
      </div>
      
      <Toaster />
    </div>
  )
}