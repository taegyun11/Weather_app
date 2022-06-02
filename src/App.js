import WeatherBox from "./component/WeatherBox";
import WeatherButton from "./component/WeatherButton";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ClipLoader from "react-spinners/ClipLoader";
import { Container } from "react-bootstrap";

//1. 앱시작시 현재 위치 기반 날씨가 보임
//2. 날씨 정보에는 도시, 섭씨, 화씨, 날씨 상태가 보인다
//3. 버튼 5개 (1 현재 위치,4 다른도시)
//4. 도시 버튼 클릭할때 마다 도시별 날씨가 나온다
//5. Current Location 클릭시 다시 현재 위치 기반의 날씨 정보가 보인다
//6. 데이터 들고오는 동안 로딩 스피너가 돈다

const cities = ["paris", "new york", "tokyo", "seoul"];
const API_KEY = "ea2805308bfd80956ac2d1ed4c6ad9d2"
const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("paris");
  const [loading, setLoading] = useState(false);
  const [apiError, setAPIError] = useState("");

  const getWeatherByCurrentLocation = async (lat, lon) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      setWeather(data);
      setLoading(false);
    } catch (err) {
      console.log("this is the error", err)
      setAPIError(err.message);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const{latitude, longitude} = position.coords
      getWeatherByCurrentLocation(latitude, longitude);
    });
  };

  const getWeatherByCity = async () => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      setWeather(data);
      setLoading(false);
    } catch (err) {
      console.log("this is the error", err)
      setAPIError(err.message);
      setLoading(false);
    }
  };

  //nothing on array = like componentDidMount
  useEffect(() => {
    if(city ==null){
      setLoading(true);
      getCurrentLocation();
    }else{
      setLoading(true)
      getWeatherByCity()
   }
  }, [city]);

  const handleCityChange = (city) => {
    if (city === "current") {
      setCity( null );
    } else {
      setCity(city);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="container">
          <ClipLoader color="#f88c6b" loading={loading} size={150} />
        </div>
      ) : !apiError ? (
        <div className="container">
          <WeatherBox weather={weather} />
          <WeatherButton
            cities={cities}
            handleCityChange={handleCityChange}
            selectedCity={city}
          />
        </div>
      ): (
        apiError
      )}
    </div>
  );
};

export default App;
