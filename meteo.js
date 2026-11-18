const weatherStatus = document.querySelector('#meteo-stato');
const weatherData = document.querySelector('#meteo-dati');
const weatherTemperature = document.querySelector('#meteo-temperatura');
const weatherWind = document.querySelector('#meteo-vento');
const weatherTime = document.querySelector('#meteo-ora');
const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=45.0703&longitude=7.6869&current=temperature_2m,wind_speed_10m&timezone=Europe%2FRome';

function formatWeatherTime(value) {
  const [dateValue, timeValue] = value.split('T');
  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12);
  const formattedDate = new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return `${formattedDate}, ${timeValue}`;
}

async function loadWeather() {
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error(`Richiesta meteo non riuscita: ${response.status}`);
    }

    const forecast = await response.json();
    const current = forecast.current;
    const units = forecast.current_units;
    if (
      !current
      || !units
      || !Number.isFinite(current.temperature_2m)
      || !Number.isFinite(current.wind_speed_10m)
      || typeof current.time !== 'string'
      || typeof units.temperature_2m !== 'string'
      || typeof units.wind_speed_10m !== 'string'
    ) {
      throw new Error('La risposta meteo non contiene i dati correnti attesi.');
    }

    const numberFormat = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 });
    weatherTemperature.textContent = `${numberFormat.format(current.temperature_2m)} ${units.temperature_2m}`;
    weatherWind.textContent = `${numberFormat.format(current.wind_speed_10m)} ${units.wind_speed_10m}`;
    weatherTime.dateTime = current.time;
    weatherTime.textContent = formatWeatherTime(current.time);
    weatherData.hidden = false;
    weatherStatus.hidden = true;
  } catch (error) {
    console.error('Errore nel caricamento del meteo:', error);
    weatherStatus.textContent = 'Dati meteo momentaneamente non disponibili.';
  }
}

loadWeather();
