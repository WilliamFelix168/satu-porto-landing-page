import { LiveDashboard } from "@/components/landing/dashboard/live-dashboard";
import { GlowTone } from "@/components/landing/glow";
import { GradientBorderPanel } from "@/components/landing/gradient-border-panel";
import { dashboardContent as dashboard } from "@/lib/content";
import { getDashboardDisplay } from "@/lib/dashboard-display";

/**
 * Abstract product mock for the hero. Rendered as a single labelled image so
 * screen readers hear one summary instead of every mock number. Values are
 * formatted here, on the server; the client card only animates them.
 */
export function DashboardPreview() {
  return (
    <GradientBorderPanel
      glowTone={GlowTone.Emerald}
      role="img"
      aria-label={dashboard.accessibleLabel}
      className="text-left"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="mx-auto truncate rounded-full border border-white/10 bg-white/[0.03] px-3 py-0.5 text-2xs text-zinc-400">
          {dashboard.windowTitle}
        </span>
      </div>

      <LiveDashboard display={getDashboardDisplay()} />
    </GradientBorderPanel>
  );
}
