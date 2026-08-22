export type CurrentWeather = {
  temperature: number; // °C
  humidity: number; // %
  precipitation: number; // mm
  pressure: number; // hPa
  windSpeed: number; // km/h
  windDirection: number; // degrees
  weatherCode: number;
  time: string;
};

export type HourlyPoint = {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
};

export type DailyForecastPoint = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  weatherCode: number;
};

export type DailyHistoryPoint = {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
};

export type ThresholdConfig = {
  tempHighC: number;
  tempLowC: number;
  rainfallHeavyMm: number; // mm in last hour
  windSpeedHighKmh: number;
  humidityHighPct: number;
};

export type AlertLevel = "none" | "low" | "moderate" | "high";

export type ActiveAlert = {
  id: string;
  parameter: string;
  message: string;
  level: AlertLevel;
  value: number;
  threshold: number;
};

// University of Abuja main campus (Giri, Abuja, Nigeria) — approximate coordinates
export const CAMPUS_LOCATION = {
  name: "University of Abuja, Giri Campus",
  latitude: 8.9067,
  longitude: 7.1858,
};

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  tempHighC: 35,
  tempLowC: 18,
  rainfallHeavyMm: 10,
  windSpeedHighKmh: 40,
  humidityHighPct: 90,
};

export function weatherCodeToDescription(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return map[code] ?? "Unknown conditions";
}

export function weatherCodeToIcon(code: number): string {
  const map: Record<number, string> = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    61: "🌦️",
    63: "🌧️",
    65: "🌧️",
    66: "🌧️",
    67: "🌧️",
    80: "🌦️",
    81: "🌧️",
    82: "🌧️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️",
  };
  return map[code] ?? "🌤️";
}

export function evaluateAlerts(
  current: CurrentWeather,
  thresholds: ThresholdConfig
): ActiveAlert[] {
  const alerts: ActiveAlert[] = [];

  if (current.temperature >= thresholds.tempHighC) {
    alerts.push({
      id: "temp-high",
      parameter: "Temperature",
      message: `High temperature detected: ${current.temperature.toFixed(1)}°C. Stay hydrated and avoid prolonged sun exposure.`,
      level: current.temperature >= thresholds.tempHighC + 5 ? "high" : "moderate",
      value: current.temperature,
      threshold: thresholds.tempHighC,
    });
  }

  if (current.temperature <= thresholds.tempLowC) {
    alerts.push({
      id: "temp-low",
      parameter: "Temperature",
      message: `Unusually low temperature: ${current.temperature.toFixed(1)}°C.`,
      level: "low",
      value: current.temperature,
      threshold: thresholds.tempLowC,
    });
  }

  if (current.precipitation >= thresholds.rainfallHeavyMm) {
    alerts.push({
      id: "rain-heavy",
      parameter: "Rainfall",
      message: `Heavy rainfall detected: ${current.precipitation.toFixed(1)}mm. Expect possible flooding or waterlogging on campus.`,
      level: current.precipitation >= thresholds.rainfallHeavyMm * 2 ? "high" : "moderate",
      value: current.precipitation,
      threshold: thresholds.rainfallHeavyMm,
    });
  }

  if (current.windSpeed >= thresholds.windSpeedHighKmh) {
    alerts.push({
      id: "wind-high",
      parameter: "Wind Speed",
      message: `Strong winds detected: ${current.windSpeed.toFixed(1)} km/h. Secure loose outdoor equipment.`,
      level: current.windSpeed >= thresholds.windSpeedHighKmh * 1.5 ? "high" : "moderate",
      value: current.windSpeed,
      threshold: thresholds.windSpeedHighKmh,
    });
  }

  if (current.humidity >= thresholds.humidityHighPct) {
    alerts.push({
      id: "humidity-high",
      parameter: "Humidity",
      message: `Very high humidity: ${current.humidity.toFixed(0)}%. Conditions may feel uncomfortable.`,
      level: "low",
      value: current.humidity,
      threshold: thresholds.humidityHighPct,
    });
  }

  return alerts;
}
