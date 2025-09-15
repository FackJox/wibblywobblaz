import React from 'react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CardDemo() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Card Recipe System Demo</h2>
      
      {/* Basic Card */}
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Basic Card</CardTitle>
          <CardDescription>This is a basic card with default styling</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This card uses the default Panda CSS recipes with fluid typography and spacing.</p>
        </CardContent>
        <CardFooter>
          <Button variant="default">Action</Button>
        </CardFooter>
      </Card>

      {/* Card with Variants */}
      <Card elevation="high" padding="lg" className="w-96">
        <CardHeader spacing="loose">
          <CardTitle size="xl">Enhanced Card</CardTitle>
          <CardDescription size="lg">High elevation with loose spacing</CardDescription>
        </CardHeader>
        <CardContent spacing="loose">
          <p>This card demonstrates the elevation and spacing variants available in the card recipe system.</p>
        </CardContent>
        <CardFooter spacing="loose" alignment="between">
          <Button variant="outline">Cancel</Button>
          <Button variant="default">Confirm</Button>
        </CardFooter>
      </Card>

      {/* Compact Card */}
      <Card elevation="flat" padding="sm" className="w-96">
        <CardHeader spacing="tight">
          <CardTitle size="sm">Compact Card</CardTitle>
          <CardDescription size="sm">Minimal spacing and flat design</CardDescription>
        </CardHeader>
        <CardContent spacing="tight">
          <p className="text-sm">A more compact card design with tight spacing.</p>
        </CardContent>
        <CardFooter spacing="tight" alignment="end">
          <Button variant="secondary" size="sm">OK</Button>
        </CardFooter>
      </Card>
    </div>
  )
}