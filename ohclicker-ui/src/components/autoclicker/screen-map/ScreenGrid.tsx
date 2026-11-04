// Decorative background of the screen map (grid, fake windows, taskbar).
export const ScreenGrid: React.FC = () => (
  <div className="absolute inset-0 bg-app-bg border border-app-border rounded-lg overflow-hidden flex items-center justify-center p-3 select-none pointer-events-none">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d_1px,transparent_1px),linear-gradient(to_bottom,#1f293d_1px,transparent_1px)] bg-size-[1.5rem_1.5rem] opacity-40" />

    {/* Faux Windows Background Elements */}
    <div className="absolute left-[8%] top-[12%] h-[38%] w-[34%] rounded-sm border border-app-border bg-app-surface/50">
      <div className="h-2.5 border-b border-app-border bg-app-surface/80" />
    </div>
    <div className="absolute left-[46%] top-[22%] h-[44%] w-[42%] rounded-sm border border-app-border bg-app-surface/50">
      <div className="h-2.5 border-b border-app-border bg-app-surface/80" />
    </div>

    {/* Bottom taskbar indicator dots */}
    <div className="absolute flex items-center justify-center bottom-0 h-3 border-t border-app-border w-full bg-app-bg">
      <div className="relative flex items-center gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={`size-1.5 rounded-xs ${i === 1 ? "bg-app-text-primary" : "bg-app-text-muted"}`}
          />
        ))}
      </div>
    </div>
  </div>
);