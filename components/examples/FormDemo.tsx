"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormData {
  name: string
  email: string
  message: string
  category: string
  phone: string
  bio: string
}

export function FormDemo() {
  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      category: "",
      phone: "",
      bio: "",
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Form Recipe System Demo</h1>
        <p className="text-muted-foreground">
          Comprehensive demonstration of all form component recipes with their variants.
        </p>
      </div>

      {/* Main Contact Form */}
      <Card elevation="medium" padding="lg">
        <CardHeader spacing="normal">
          <CardTitle size="lg">Contact Form</CardTitle>
          <CardDescription size="md">
            Complete form with validation states and various input types
          </CardDescription>
        </CardHeader>
        <CardContent spacing="normal">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Input Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem spacing="normal">
                    <FormLabel size="md">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your full name" 
                        inputSize="md"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription size="sm">
                      This will be displayed on your public profile.
                    </FormDescription>
                    <FormMessage size="sm" />
                  </FormItem>
                )}
              />

              {/* Email with Error State */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem spacing="normal">
                    <FormLabel size="md" state="error">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter your email" 
                        inputSize="md"
                        state="error"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription size="sm">
                      We&apos;ll never share your email with anyone else.
                    </FormDescription>
                    <FormMessage size="sm" state="error">
                      Please enter a valid email address.
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Phone with Success State */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem spacing="normal">
                    <FormLabel size="md" state="success">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="Enter your phone number" 
                        inputSize="md"
                        state="success"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription size="sm">
                      Optional - for urgent inquiries only.
                    </FormDescription>
                    <FormMessage size="sm" state="success">
                      Phone number format is valid.
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Select with Warning State */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem spacing="normal">
                    <FormLabel size="md" state="warning">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger selectSize="md" state="warning">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription size="sm">
                      Choose the most appropriate category for your inquiry.
                    </FormDescription>
                    <FormMessage size="sm" state="warning">
                      Please select a category to help us route your message.
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* Textarea */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem spacing="normal">
                    <FormLabel size="md">Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us more about your inquiry..."
                        textareaSize="md"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription size="sm">
                      Provide as much detail as possible to help us assist you.
                    </FormDescription>
                    <FormMessage size="sm" />
                  </FormItem>
                )}
              />

              {/* Bio Textarea - Large */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem spacing="loose">
                    <FormLabel size="lg">Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about yourself..."
                        textareaSize="lg"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription size="lg">
                      Optional extended biography for your profile.
                    </FormDescription>
                    <FormMessage size="lg" />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full">
                Submit Form
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Form Size Variants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card elevation="low" padding="md">
          <CardHeader spacing="tight">
            <CardTitle size="md">Small Form</CardTitle>
            <CardDescription size="sm">Compact form controls</CardDescription>
          </CardHeader>
          <CardContent spacing="tight">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Small input" inputSize="sm" />
                <p className="text-xs text-muted-foreground">Small description</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger selectSize="sm">
                    <SelectValue placeholder="Small select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="Small textarea" textareaSize="sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card elevation="medium" padding="md">
          <CardHeader spacing="normal">
            <CardTitle size="lg">Medium Form</CardTitle>
            <CardDescription size="md">Standard form controls</CardDescription>
          </CardHeader>
          <CardContent spacing="normal">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Medium input" inputSize="md" />
                <p className="text-sm text-muted-foreground">Medium description</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger selectSize="md">
                    <SelectValue placeholder="Medium select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea placeholder="Medium textarea" textareaSize="md" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card elevation="high" padding="lg">
          <CardHeader spacing="loose">
            <CardTitle size="xl">Large Form</CardTitle>
            <CardDescription size="lg">Spacious form controls</CardDescription>
          </CardHeader>
          <CardContent spacing="loose">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-base font-medium">Name</label>
                <Input placeholder="Large input" inputSize="lg" />
                <p className="text-base text-muted-foreground">Large description with more space</p>
              </div>
              
              <div className="space-y-3">
                <label className="text-base font-medium">Category</label>
                <Select>
                  <SelectTrigger selectSize="lg">
                    <SelectValue placeholder="Large select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-base font-medium">Message</label>
                <Textarea placeholder="Large textarea" textareaSize="lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation State Examples */}
      <Card elevation="medium" padding="lg">
        <CardHeader spacing="normal">
          <CardTitle size="lg">Validation States</CardTitle>
          <CardDescription size="md">
            Examples of different form validation states
          </CardDescription>
        </CardHeader>
        <CardContent spacing="normal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default State</label>
                <Input placeholder="Normal input" />
                <p className="text-sm text-muted-foreground">This field is in normal state</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-destructive">Error State</label>
                <Input placeholder="Error input" state="error" />
                <p className="text-sm font-medium text-destructive">This field has an error</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-600">Success State</label>
                <Input placeholder="Success input" state="success" />
                <p className="text-sm font-medium text-green-600">This field is valid</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-amber-600">Warning State</label>
                <Input placeholder="Warning input" state="warning" />
                <p className="text-sm font-medium text-amber-600">This field has a warning</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Information */}
      <Card elevation="low" padding="lg">
        <CardHeader spacing="normal">
          <CardTitle size="lg">Form Recipe System</CardTitle>
          <CardDescription size="md">
            Complete form component recipes with PandaCSS
          </CardDescription>
        </CardHeader>
        <CardContent spacing="normal">
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Available Form Recipes:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>FormItem:</strong> Container with spacing variants (tight, normal, loose)</li>
                <li><strong>FormLabel:</strong> Labels with state and size variants</li>
                <li><strong>FormControl:</strong> Wrapper for form inputs</li>
                <li><strong>FormDescription:</strong> Help text with size variants</li>
                <li><strong>FormMessage:</strong> Validation messages with state and size variants</li>
                <li><strong>Input:</strong> Text inputs with state and size variants</li>
                <li><strong>Textarea:</strong> Multi-line inputs with state and size variants</li>
                <li><strong>SelectTrigger:</strong> Select dropdowns with state and size variants</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Validation States:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>default:</strong> Normal state</li>
                <li><strong>error:</strong> Error state with destructive colors</li>
                <li><strong>success:</strong> Success state with green colors</li>
                <li><strong>warning:</strong> Warning state with amber colors</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Size Variants:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>sm:</strong> Small, compact forms</li>
                <li><strong>md:</strong> Medium, standard forms</li>
                <li><strong>lg:</strong> Large, spacious forms</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}