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
    .description("The best weather app")
    .version("1.0.1");

program
    .command("get-temp")
    .description("Get the temp by city name")
    .argument("<string>", "city name")
    .option("-s, --scale <string>", "choose c for celsius or f for fernehit", "c")
    .action((city, options) => {
      let units = "metric"
      if(options.scale === "f") {
        units = ""
      }
      getTempByCityName(city, apiKey, units)

    });

const getTempByCityName = async (cityName, apiKey, units) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${apiKey}&units=${units}`;
    const response = await fetch(URL);
    if (response.status === 200) {
      const ans = await response.json()
      // console.log(ans)
      console.log(`It's ${ans.main.temp} degrees in ${ans.name}`)
    } else {
      console.log("error fetching data from weather api")
    }
};

program.parse();
