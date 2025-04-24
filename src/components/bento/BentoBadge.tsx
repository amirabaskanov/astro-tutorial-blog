interface BentoBadgeProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  text: string
}

export default function BentoBadge({ icon: Icon, text }: BentoBadgeProps) {
  return (
    <div className="flex items-center gap-2 bg-[#0F1219] border border-[#1E293B] rounded-full py-1.5 px-3">
      <Icon className="size-5 text-white" />
      <span className="text-sm font-medium text-white">{text}</span>
    </div>
  )
} 