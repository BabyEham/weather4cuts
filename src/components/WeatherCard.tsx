import type { WeatherData } from "../types";
import { useTranslation } from "react-i18next";

interface WeatherCardProps {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function WeatherCard({
  weather,
  isLoading,
  error,
  onRetry,
}: WeatherCardProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="card bg-white">
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="card bg-white">
        <div className="card-body">
          <div className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error || t("home.error.weatherFetch")}</span>
          </div>
          <button onClick={onRetry} className="btn btn-primary">
            {t("home.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white">
      <div className="card-body">
        <h2 className="card-title justify-center text-3xl">
          {t(`weather.${weather.condition}`)}
        </h2>
        <div className="flex justify-center items-center gap-4 my-4">
          <div className="text-6xl font-bold">{weather.temperature}°C</div>
        </div>
        <p className="text-center text-base-content/70">
          {weather.location && <span>{weather.location}</span>}
        </p>
      </div>
    </div>
  );
}
