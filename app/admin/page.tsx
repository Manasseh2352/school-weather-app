"use client";

import { useEffect, useState } from "react";
import { DEFAULT_THRESHOLDS, ThresholdConfig } from "@/lib/types";

const THRESHOLD_KEY = "uniabuja-weather-thresholds";

const FIELDS: {
  key: keyof ThresholdConfig;
  label: string;
  helper: string;
  unit: string;
  min: number;
  max: number;
}[] = [
  {
    key: "tempHighC",
    label: "Warn when it's this hot",
    helper: "Good for flagging heat that could affect outdoor exams or events.",
    unit: "°C",
    min: 28,
    max: 45,
  },
  {
    key: "tempLowC",
    label: "Warn when it's this cold",
    helper: "Rare in Abuja, but useful during the harmattan season.",
    unit: "°C",
    min: 10,
    max: 24,
  },
  {
    key: "rainfallHeavyMm",
    label: "Warn on heavy rain",
    helper: "Lower this if flooding-prone areas need earlier warnings.",
    unit: "mm/hr",
    min: 2,
    max: 30,
  },
  {
    key: "windSpeedHighKmh",
    label: "Warn on strong wind",
    helper: "Helps flag conditions that could topple loose signage or tents.",
    unit: "km/h",
    min: 15,
    max: 80,
  },
  {
    key: "humidityHighPct",
    label: "Warn on high humidity",
    helper: "A comfort warning rather than a safety one.",
    unit: "%",
    min: 60,
    max: 100,
  },
];

export default function AdminPage() {
  const [thresholds, setThresholds] = useState<ThresholdConfig>(DEFAULT_THRESHOLDS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(THRESHOLD_KEY);
    if (stored) {
      try {
        setThresholds(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const updateField = (key: keyof ThresholdConfig, value: number) => {
    setThresholds((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const save = () => {
    window.localStorage.setItem(THRESHOLD_KEY, JSON.stringify(thresholds));
    setSaved(true);
  };

  const reset = () => {
    setThresholds(DEFAULT_THRESHOLDS);
    window.localStorage.setItem(THRESHOLD_KEY, JSON.stringify(DEFAULT_THRESHOLDS));
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
          When should we alert people?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
          Drag each slider to set the point where the dashboard shows a warning. Higher isn&apos;t
          always safer — set these to match real campus conditions.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 sm:p-5 flex flex-col gap-6">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <div className="flex items-baseline justify-between gap-2">
              <label htmlFor={field.key} className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {field.label}
              </label>
              <span className="text-sm font-medium text-campus-600 shrink-0">
                {thresholds[field.key]}
                {field.unit}
              </span>
            </div>
            <input
              id={field.key}
              type="range"
              min={field.min}
              max={field.max}
              step={1}
              value={thresholds[field.key]}
              onChange={(e) => updateField(field.key, Number(e.target.value))}
              className="w-full mt-2 accent-campus-500"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{field.helper}</p>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={save}
            className="px-4 py-1.5 rounded-md bg-campus-500 text-white text-sm font-medium hover:bg-campus-600"
          >
            Save changes
          </button>
          <button
            onClick={reset}
            className="px-4 py-1.5 rounded-md border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Reset to defaults
          </button>
          {saved && <span className="text-xs text-campus-600">Saved ✓</span>}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200 text-xs rounded-lg p-3">
        Note: this prototype stores threshold settings in the browser (localStorage) for
        simplicity. A production deployment would persist these in the centralized database and
        restrict this page to authenticated administrators, as described in Chapter 3 of the
        project report.
      </div>
    </div>
  );
}
