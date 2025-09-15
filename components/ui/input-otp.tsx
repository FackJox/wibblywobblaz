"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { css, cx } from "../../styled-system/css"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cx(
      css({
        display: "flex",
        alignItems: "center",
        gap: "2",
        "&:has([disabled])": {
          opacity: "0.5"
        }
      }),
      containerClassName
    )}
    className={cx(
      css({
        "&:disabled": {
          cursor: "not-allowed"
        }
      }),
      className
    )}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx(
    css({
      display: "flex",
      alignItems: "center"
    }),
    className
  )} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cx(
        css({
          position: "relative",
          display: "flex",
          height: "10",
          width: "10",
          alignItems: "center",
          justifyContent: "center",
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderRight: "1px solid",
          borderColor: "input",
          fontSize: "sm",
          transition: "all",
          "&:first-child": {
            borderTopLeftRadius: "md",
            borderBottomLeftRadius: "md",
            borderLeft: "1px solid",
            borderLeftColor: "input"
          },
          "&:last-child": {
            borderTopRightRadius: "md",
            borderBottomRightRadius: "md"
          }
        }),
        isActive && css({
          zIndex: "10",
          boxShadow: "0 0 0 2px hsl(var(--ring))"
        }),
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className={css({
          pointerEvents: "none",
          position: "absolute",
          inset: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        })}>
          <div className={css({
            height: "4",
            width: "1px",
            animationName: "caret-blink",
            backgroundColor: "foreground",
            animationDuration: "1000ms"
          })} />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
