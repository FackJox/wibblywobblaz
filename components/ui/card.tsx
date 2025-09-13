import * as React from "react"
import { cx } from "@/styled-system/css"
import { 
  card,
  cardHeader,
  cardTitle,
  cardDescription,
  cardContent,
  cardFooter,
  type CardVariantProps,
  type CardHeaderVariantProps,
  type CardTitleVariantProps,
  type CardDescriptionVariantProps,
  type CardContentVariantProps,
  type CardFooterVariantProps
} from "@/styled-system/recipes"

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardVariantProps {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(card({ elevation, padding }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

export interface CardHeaderProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardHeaderVariantProps {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, spacing, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(cardHeader({ spacing }), className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

export interface CardTitleProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardTitleVariantProps {}

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(cardTitle({ size }), className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

export interface CardDescriptionProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardDescriptionVariantProps {}

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(cardDescription({ size }), className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

export interface CardContentProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardContentVariantProps {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, spacing, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cx(cardContent({ spacing }), className)} 
      {...props} 
    />
  )
)
CardContent.displayName = "CardContent"

export interface CardFooterProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    CardFooterVariantProps {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, spacing, alignment, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(cardFooter({ spacing, alignment }), className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  // Export the recipe functions for advanced usage
  card as cardRecipe,
  cardHeader as cardHeaderRecipe,
  cardTitle as cardTitleRecipe,
  cardDescription as cardDescriptionRecipe,
  cardContent as cardContentRecipe,
  cardFooter as cardFooterRecipe
}
