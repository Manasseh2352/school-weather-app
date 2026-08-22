import { DailyForecastPoint, weatherCodeToDescription, weatherCodeToIcon } from "@/lib/types";

function dayLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function ForecastStrip({ days }: { days: DailyForecastPoint[] }) {
  if (days.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {days.map((day) => (
        <div
          key={day.date}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-3"
        >
          <div className="flex items-center justify-between w-full gap-3">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {dayLabel(day.date)}
            </p>
            <div
              aria-label={weatherCodeToDescription(day.weatherCode)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-xl shadow-inner dark:bg-slate-700"
              title={weatherCodeToDescription(day.weatherCode)}
            >
              {weatherCodeToIcon(day.weatherCode)}
            </div>
          </div>

          <div className="flex items-center justify-between w-full sm:flex-col sm:items-start sm:justify-start gap-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {weatherCodeToDescription(day.weatherCode)}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {day.tempMax.toFixed(0)}°
              </span>
              <span className="text-sm text-slate-400 dark:text-slate-500">
                {day.tempMin.toFixed(0)}°
              </span>
            </div>
          </div>

          <p className="text-xs text-campus-600 dark:text-campus-100 sm:mt-1">
            {day.precipitationProbability.toFixed(0)}% chance of rain
            {day.precipitationSum > 0 ? ` · ${day.precipitationSum.toFixed(1)}mm` : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
