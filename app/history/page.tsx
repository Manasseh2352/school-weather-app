"use client";

import { useEffect, useState } from "react";
import { DailyHistoryPoint } from "@/lib/types";
import { TemperatureTrendChart, RainfallTrendChart } from "@/components/HistoryChart";

const RANGE_OPTIONS = [7, 14, 30];

export default function HistoryPage() {
  const [days, setDays] = useState(14);
  const [data, setData] = useState<DailyHistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/history?days=${days}`)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load historical records right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Historical Weather Trends</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Daily temperature and rainfall records for the campus area.
          </p>
        </div>
        <div className="flex gap-1 flex-wrap">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setDays(opt)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                days === opt
                  ? "bg-campus-500 text-white border-campus-500"
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              Last {opt} days
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-200 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-slate-400 dark:text-slate-500 text-sm">Loading historical data…</div>
      ) : (
        <>
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Temperature Range (°C)</h3>
            <TemperatureTrendChart data={data} />
          </section>
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Daily Rainfall (mm)</h3>
            <RainfallTrendChart data={data} />
          </section>
        </>
      )}
    </div>
  );
}
