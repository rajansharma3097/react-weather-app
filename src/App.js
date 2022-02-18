import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { Loader } from "semantic-ui-react";
import WeatherCard from "./components/WeatherCard";
import Header from "./components/Header";
import Forecast from "./components/Forecast";

function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [sunrise, setSunrise] = useState(null);
  const [sunset, setSunset] = useState(null);
  const [icon, setIcon] = useState("");
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

    const fetchData = async () => {
      const currentWeather = await axios.get(
        `${process.env.REACT_APP_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      );

      const forecast = await axios.get(
        `${process.env.REACT_APP_API_URL}/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minute&appid=${process.env.REACT_APP_API_KEY}&units=metric`
      );

      setLoading(false);
      setTemperature(currentWeather.data.main.temp);
      setSunset(currentWeather.data.sys.sunset);
      setSunrise(currentWeather.data.sys.sunrise);
      setHumidity(currentWeather.data.main.humidity);
      setCity(currentWeather.data.name);
      setIcon(currentWeather.data.weather[0].main);
      setForecast(forecast.data.daily);
    };

    fetchData();
  }, [latitude, longitude]);

  return (
    <div className="main">
      <Header />
      {loading ? (
        <div>
          <p>Loading... Please Wait</p>
          <Loader active inline="centered" />
        </div>
      ) : (
        <WeatherCard
          temperature={temperature}
          humidity={humidity}
          sunrise={sunrise}
          sunset={sunset}
          city={city}
          icon={icon}
        />
      )}
      <Forecast forcast={forecast} />
    </div>
  );
}

export default App;
