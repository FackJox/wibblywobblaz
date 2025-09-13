import { cx, css } from "@/styled-system/css"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(css({
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        borderRadius: "md",
        bg: "muted"
      }), className)}
      {...props}
    />
  )
}

export { Skeleton }
