// Recommended order for your solution:
// 1. Install the dotenv package.
// 2. Add a dotenv file, put the API key in dotenv and print it.
// 3. Install the node-fetch package.
// 4. Create a method that calls the API to get temperature using node-fetch.
// 5. Install the commander package.
// 6. Create a basic commander skeleton without the actions implementation (just the metadata and commands configuration).
// 7. Implement the first command, including the optional arguments.
// 8. BONUS - Implement the second command.

// Commander usage example for your reference:
import { Command } from "commander";
import dotenv from "dotenv";
import fetch from "node-fetch";

const program = new Command();
dotenv.config();
const apiKey = process.env.WEATHER_APP_API;

program
    .name("Weather App V2")
    .description("The best weather app!")
    .version("1.0.1")
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
    handleWeatherJsonAns(ans) &&
        console.log(
            `It's ${ans.main.temp}${units.baseUnit} degrees in ${ans.name}`
        );
};

const getDetailedForecastByCityName = async (cityName, apiKey, units) => {
    const ans = await fetchWeatherAndParseToJson(cityName, apiKey, units);
    handleWeatherJsonAns(ans) &&
        console.log(
            `Today we will have ${ans.weather[0].description}, temperatures will range from ${ans.main.temp_min}${units.baseUnit} to ${ans.main.temp_max}${units.baseUnit} with a wind speed of ${ans.wind.speed} ${units.windSpeedUnits}`
        );
};

const handleWeatherJsonAns = (answer) => {
    if (answer.cod !== 200) {
        console.log(
            "error fetching data from weather api",
            answer.cod,
            answer.message
        );
        return false
    } else {
      return true
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
