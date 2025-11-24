import type { WeatherCondition } from "../types";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { useTranslation } from "react-i18next";

interface WeatherSelectorProps {
  selectedWeather: WeatherCondition;
  onSelect: (weather: WeatherCondition) => void;
}

const weatherOptions: Array<{
  type: WeatherCondition;
  icon: React.ReactNode;
  gradient: string;
}> = [
  {
    type: "sunny",
    icon: <WbSunnyIcon sx={{ fontSize: 48 }} />,
    gradient: "from-yellow-400 to-orange-400",
  },
  {
    type: "cloudy",
    icon: <CloudIcon sx={{ fontSize: 48 }} />,
    gradient: "from-gray-400 to-gray-500",
  },
  {
    type: "rainy",
    icon: <ThunderstormIcon sx={{ fontSize: 48 }} />,
    gradient: "from-blue-400 to-blue-600",
  },
  {
    type: "snowy",
    icon: <AcUnitIcon sx={{ fontSize: 48 }} />,
    gradient: "from-cyan-300 to-blue-400",
  },
];

export default function WeatherSelector({
  selectedWeather,
  onSelect,
}: WeatherSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-center mb-4">
        {t("home.selectWeather")}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {weatherOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className={`
              relative overflow-hidden rounded-xl p-6 transition-all
              ${
                selectedWeather === option.type
                  ? "ring-4 ring-primary scale-105"
                  : "hover:scale-105"
              }
              bg-linear-to-br ${option.gradient}
            `}
          >
            <div className="flex flex-col items-center gap-2 text-white">
              {option.icon}
              <span className="font-bold text-lg">
                {t(`weather.${option.type}`)}
              </span>
            </div>
            {selectedWeather === option.type && (
              <div className="absolute top-2 right-2">
                <div className="badge badge-success gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
