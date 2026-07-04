export type CurrentWeather = {
  temp: number;
  windSpeed: number;
  condition: string;
  icon: string;
};

export type DailyForecast = {
  date: string;
  maxTemp: number;
  minTemp: number;
  rain: number;
  condition: string;
  icon: string;
};

export function mapWeatherCode(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: 'Clear Sky', icon: 'wb-sunny' };
  if (code >= 1 && code <= 3) return { condition: 'Partly Cloudy', icon: 'cloud-queue' };
  if (code >= 45 && code <= 48) return { condition: 'Foggy', icon: 'filter-drama' };
  if (code >= 51 && code <= 67) return { condition: 'Drizzle/Rain', icon: 'grain' };
  if (code >= 71 && code <= 77) return { condition: 'Cold Precipitation', icon: 'ac-unit' };
  if (code >= 80 && code <= 82) return { condition: 'Rain Showers', icon: 'beach-access' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: 'flash-on' };
  return { condition: 'Overcast', icon: 'cloud' };
}

export async function fetchOpenMeteoWeather(latitude: number, longitude: number) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    '&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto';
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Weather service is unavailable.');
  }

  const json = await response.json();
  const mapped = mapWeatherCode(json.current_weather?.weathercode ?? -1);
  const current: CurrentWeather | null = json.current_weather
    ? {
        temp: json.current_weather.temperature,
        windSpeed: json.current_weather.windspeed,
        condition: mapped.condition,
        icon: mapped.icon,
      }
    : null;

  const daily: DailyForecast[] = (json.daily?.time ?? []).map((date: string, index: number) => {
    const day = mapWeatherCode(json.daily.weathercode[index]);
    return {
      date,
      maxTemp: json.daily.temperature_2m_max[index],
      minTemp: json.daily.temperature_2m_min[index],
      rain: json.daily.precipitation_probability_max[index] ?? 0,
      condition: day.condition,
      icon: day.icon,
    };
  });

  return { current, daily };
}
