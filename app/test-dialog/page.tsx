"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function TestDialogPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Dialog & Overlay Components Test</h1>
      
      {/* Dialog Test */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Dialog Components</h2>
        <div className="flex gap-4 flex-wrap">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Small Dialog</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle size="sm">Small Dialog</DialogTitle>
                <DialogDescription size="sm">
                  This is a small dialog with PandaCSS styling.
                </DialogDescription>
              </DialogHeader>
              <p>Content of the small dialog goes here.</p>
              <DialogFooter>
                <Button type="submit" size="sm">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Medium Dialog</Button>
            </DialogTrigger>
            <DialogContent size="md">
              <DialogHeader>
                <DialogTitle size="md">Medium Dialog</DialogTitle>
                <DialogDescription size="md">
                  This is a medium dialog with fluid spacing and animations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>This dialog uses PandaCSS recipes for consistent styling.</p>
                <p>Notice the smooth animations and responsive design.</p>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Large Dialog</Button>
            </DialogTrigger>
            <DialogContent size="lg">
              <DialogHeader alignment="center">
                <DialogTitle size="lg">Large Dialog</DialogTitle>
                <DialogDescription size="lg">
                  This is a large dialog with centered header alignment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Large dialogs provide more space for complex content.</p>
                <p>All animations and z-index handling are managed by PandaCSS.</p>
              </div>
              <DialogFooter alignment="between">
                <Button variant="ghost">Help</Button>
                <div className="space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dropdown Menu Test */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Dropdown Menu Components</h2>
        <div className="flex gap-4 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Small Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent size="sm">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem size="sm">Profile</DropdownMenuItem>
              <DropdownMenuItem size="sm">Settings</DropdownMenuItem>
              <DropdownMenuItem size="sm">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Medium Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent size="md">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem size="md">Edit</DropdownMenuItem>
              <DropdownMenuItem size="md">Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem size="md">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Large Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent size="lg">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem size="lg">Dashboard</DropdownMenuItem>
              <DropdownMenuItem size="lg">Projects</DropdownMenuItem>
              <DropdownMenuItem size="lg" inset>Settings</DropdownMenuItem>
              <DropdownMenuItem size="lg" inset>Team</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Popover Test */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Popover Components</h2>
        <div className="flex gap-4 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Small Popover</Button>
            </PopoverTrigger>
            <PopoverContent size="sm">
              <div className="space-y-2">
                <h4 className="font-medium">Small Popover</h4>
                <p className="text-sm text-muted-foreground">
                  This is a small popover with compact spacing.
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Medium Popover</Button>
            </PopoverTrigger>
            <PopoverContent size="md">
              <div className="space-y-3">
                <h4 className="font-medium">Medium Popover</h4>
                <p className="text-sm text-muted-foreground">
                  This popover uses fluid spacing for responsive design.
                </p>
                <div className="flex gap-2">
                  <Button size="sm">Action</Button>
                  <Button size="sm" variant="outline">Cancel</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Large Popover</Button>
            </PopoverTrigger>
            <PopoverContent size="lg">
              <div className="space-y-4">
                <h4 className="font-medium">Large Popover</h4>
                <p className="text-sm text-muted-foreground">
                  Large popovers provide more space for complex content and interactions.
                </p>
                <div className="space-y-2">
                  <Button className="w-full">Primary Action</Button>
                  <Button className="w-full" variant="outline">Secondary Action</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Tooltip Test */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tooltip Components</h2>
        <TooltipProvider>
          <div className="flex gap-4 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Small Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent size="sm">
                <p>Small tooltip</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Medium Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent size="md">
                <p>Medium tooltip with more content</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Large Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent size="lg">
                <p>Large tooltip with even more detailed information</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Animation Test */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Animation Tests</h2>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Test the animations by rapidly opening and closing the components above. 
            All animations should be smooth and consistent.
          </p>
          <p className="text-sm text-muted-foreground">
            Notice how the overlays fade in/out and content scales properly.
          </p>
        </div>
      </div>
    </div>
  )
}