"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed z-[100] flex flex-col p-4 gap-3 max-w-[100vw] m-0 list-none outline-none",
      "top-0 right-0 sm:top-auto sm:bottom-0 sm:right-0 md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center space-x-4 overflow-hidden rounded-xl p-4 pr-8 shadow-lg transition-all border",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 text-gray-900 shadow-md",
        success: "bg-emerald-50 border-emerald-200 text-emerald-900",
        destructive: "bg-red-50 border-red-200 text-red-900",
        warning: "bg-amber-50 border-amber-200 text-amber-900",
        info: "bg-blue-50 border-blue-200 text-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        toastVariants({ variant }),
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[swipe=end]:animate-out data-[state=closed]:fade-out-80",
        "data-[state=closed]:slide-out-to-right-full",
        "data-[state=open]:slide-in-from-top-full",
        "data-[state=open]:sm:slide-in-from-bottom-full",
        "data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
        "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
        className
      )}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors",
      "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
      "group-[.destructive]:border-red-300 group-[.destructive]:hover:bg-red-100 group-[.destructive]:hover:text-red-700",
      "group-[.success]:border-emerald-300 group-[.success]:hover:bg-emerald-100 group-[.success]:hover:text-emerald-700",
      "group-[.warning]:border-amber-300 group-[.warning]:hover:bg-amber-100 group-[.warning]:hover:text-amber-700",
      "group-[.info]:border-blue-300 group-[.info]:hover:bg-blue-100 group-[.info]:hover:text-blue-700",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity",
      "text-gray-500 hover:text-gray-700 focus:opacity-100 focus:outline-none",
      "group-hover:opacity-100",
      "group-[.destructive]:text-red-500 group-[.destructive]:hover:text-red-700",
      "group-[.success]:text-emerald-500 group-[.success]:hover:text-emerald-700",
      "group-[.warning]:text-amber-500 group-[.warning]:hover:text-amber-700",
      "group-[.info]:text-blue-500 group-[.info]:hover:text-blue-700",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastIcon = ({ variant }: { variant?: string }) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-emerald-600" />
    case "destructive":
      return <AlertCircle className="h-5 w-5 text-red-600" />
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-amber-600" />
    case "info":
      return <Info className="h-5 w-5 text-blue-600" />
    default:
      return null
  }
}

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold [&+div]:text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// Toast component with icon
const ToastWithIcon = React.forwardRef<
  React.ElementRef<typeof Toast>,
  React.ComponentPropsWithoutRef<typeof Toast> &
    VariantProps<typeof toastVariants>
>(({ className, variant = "default", children, ...props }, ref) => {
  return (
    <Toast ref={ref} variant={variant} className={className} {...props}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <ToastIcon variant={variant} />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </Toast>
  )
})
ToastWithIcon.displayName = "ToastWithIcon"

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastWithIcon,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}