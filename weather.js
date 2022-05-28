import { myLogger } from "mondayu-logger-tom-portugez";
import { Command } from "commander";
import dotenv from "dotenv";
import fetch from "node-fetch";

const program = new Command();
dotenv.config();
const apiKey = process.env.WEATHER_APP_API;

program
    .name("Weather App V2")
    .description("The best weather app!")
    .version("2.2.0")
    .option(
        "-s, --scale <string>",
        "choose c for celsius or f for fahrenheit (you can also k for kelvin if you know what you doing.)",
        "c" //default value
    );

program.parse(); //this line insert the help from 'name' to 'command'

program
    .command("get-temp")
    .description("Get the temperature by city name.")
    .argument("<string>", "city name")
    .action((city) => {
        const units = setUnitsForDegree(program.opts().scale);
        getTempByCityName(city, apiKey, units);
    });

program
    .command("get-detailed-forecast")
    .description(
        "Get more then just a temperature, get a detailed weather forecast!"
    )
    .argument("<string>", "city name")
    .action((city) => {
        const unitsInfo = setUnitsForDegree(program.opts().scale);
        getDetailedForecastByCityName(city, apiKey, unitsInfo);
    });

const getTempByCityName = async (cityName, apiKey, units) => {
    const ans = await fetchWeatherAndParseToJson(cityName, apiKey, units);
    if (handleWeatherJsonAns(ans)) {
        const message = `It's ${ans.main.temp}${units.baseUnit} degrees in ${ans.name}`;
        handleMessage(message);
    }
};

const getDetailedForecastByCityName = async (cityName, apiKey, units) => {
    const ans = await fetchWeatherAndParseToJson(cityName, apiKey, units);
    if (handleWeatherJsonAns(ans)) {
        const message = `Today we will have ${ans.weather[0].description}, temperatures will range from ${ans.main.temp_min}${units.baseUnit} to ${ans.main.temp_max}${units.baseUnit} with a wind speed of ${ans.wind.speed} ${units.windSpeedUnits}`;
        handleMessage(message);
    }
};

const handleMessage = (message) => {
    myLogger.log(message);
    console.log(message);
};

const handleErrorMessage = (message) => {
    myLogger.error(message);
    console.log(message);
};

const handleWeatherJsonAns = (answer) => {
    if (answer.cod !== 200) {
        const message = `error fetching data from weather api ${answer.cod} ${answer.message}`;
        handleErrorMessage(message)
        return false;
    } else {
        return true;
    }
};

const fetchWeatherAndParseToJson = async (cityName, apiKey, units) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=${units.units}`;
    const response = await fetch(URL);
    return await response.json();
};

const setUnitsForDegree = (baseUnit) => {
    let units = "metric";
    let windSpeedUnits = "meter/sec";
    if (baseUnit === "f") {
        units = "imperial";
        windSpeedUnits = "miles/hour";
    } else if (baseUnit === "k") {
        units = "standard";
    }
    return { units, baseUnit, windSpeedUnits };
};

program.parse();
