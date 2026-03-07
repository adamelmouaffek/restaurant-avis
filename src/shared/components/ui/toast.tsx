"use client";

import { cn } from "@/shared/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
}

const typeStyles: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

function Toast({ message, type }: ToastProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2 fade-in duration-300",
        typeStyles[type]
      )}
    >
      {message}
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastProps[];
}

function ToastContainer({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

export { Toast, ToastContainer };
export type { ToastProps, ToastType };
