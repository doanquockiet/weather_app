import { MainWrapper } from "./style.module";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import {
  BsFillSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFog2Fill,
} from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface WeatherDataProps {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  weather: {
    main: string;
  }[];
  wind: {
    speed: number;
  };
}

const DisplayWeather = () => {
  const api_key = "0cc86d16bf572f78cdc96c096c7627e5";
  const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

  const [weatherData, setWeatherData] = useState<WeatherDataProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCity, setSearchCity] = useState("");

  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
      const response = await axios.get<WeatherDataProps>(url);
      return response.data;
    } catch (error) {
      console.log("Error fetching weather data:", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      return;
    }

    try {
      setIsLoading(true); // Set loading state
      const data = await fetchWeatherData(searchCity);
      setWeatherData(data); // Update weather data state
    } catch (error) {
      console.log("No results found for city:", searchCity);
      setWeatherData(null); // Clear weather data state on error
    } finally {
      setIsLoading(false); // Always set loading state to false
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchCurrentWeather(latitude, longitude).then((currentWeather) => {
        setWeatherData(currentWeather);
      });
    });
  }, []);

  const changeIconWeather = (weather: string) => {
    let iconElement: React.ReactNode;
    let iconColor: string;

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill />;
        iconColor = "blue";
        break;
      case "Clear":
        iconElement = <BsFillSunFill />;
        iconColor = "yellow";
        break;
      case "Clouds":
        iconElement = <BsCloudyFill />;
        iconColor = "green";
        break;
      case "Mist":
        iconElement = <BsCloudFog2Fill />;
        iconColor = "blue";
        break;
      default:
        iconElement = <TiWeatherPartlySunny />;
        iconColor = "black";
        break;
    }

    return (
      <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
    );
  };

  return (
    <MainWrapper>
      <div className="container">
        <div className="searchArea">
          <input
            type="text"
            placeholder="Enter a city"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <div className="searchCircle">
            <AiOutlineSearch className="searchIcon" onClick={handleSearch} />
          </div>
        </div>

        {isLoading ? (
          <div className="loading">
            <RiLoaderFill className="loadingIcon" />
            <p>Loading...</p>
          </div>
        ) : weatherData ? (
          <>
            <div className="weatherArea">
              <h1>{weatherData.name}</h1>
              <span>{weatherData.sys.country}</span>
              <div className="icon">
                {changeIconWeather(weatherData.weather[0].main)}
              </div>
              <h1>{weatherData.main.temp} °C</h1>
              <h2>{weatherData.weather[0].main}</h2>
            </div>

            <div className="bottomInfoArea">
              <div className="humidityLevel">
                <WiHumidity className="windIcon" />
                <div className="humidInfo">
                  <h1>{weatherData.main.humidity}%</h1>
                  <p>Humidity</p>
                </div>
              </div>

              <div className="wind">
                <FaWind className="windIcon" />
                <div className="humidInfo">
                  <h1>{weatherData.wind.speed} km/h</h1>
                  <p>Wind speed</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading">
            <p>No results found for city: {searchCity}</p>
          </div>
        )}
      </div>
    </MainWrapper>
  );
};

export default DisplayWeather;
