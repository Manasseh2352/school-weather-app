import { ActiveAlert } from "@/lib/types";

const levelStyles: Record<string, string> = {
  low: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200",
  moderate:
    "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200",
  high: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200",
};

export default function AlertBanner({ alerts }: { alerts: ActiveAlert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="bg-campus-50 border border-campus-100 text-campus-700 dark:bg-slate-800 dark:border-slate-700 dark:text-campus-100 rounded-xl p-4 text-sm">
        No active environmental alerts. Conditions on campus are within normal thresholds.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-xl p-4 text-sm flex items-start gap-3 ${levelStyles[alert.level]}`}
        >
          <span className="font-semibold uppercase text-xs tracking-wide mt-0.5">
            {alert.level}
          </span>
          <div>
            <p className="font-medium">{alert.parameter} Alert</p>
            <p>{alert.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
