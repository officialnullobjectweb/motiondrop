export default function LoadingSpinner({ size = "md", label }: { size?: "sm" | "md" | "lg"; label?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} rounded-full border-[#222222] border-t-[#6366F1] animate-spin`}
      />
      {label && (
        <p className="text-xs text-[#888888]">{label}</p>
      )}
    </div>
  )
}
