import fs from 'fs' //file system library used to read and write from csv
import path from 'path' // help to build a file path to direct machine to files
import dotenv from 'dotenv'
import { pathToFileURL } from "url";



dotenv.config()

const DATA_DIR = path.join(import.meta.dirname,'data') //gives the current path to the file that we're at now and we're adding on data to the end of that path

console.log(DATA_DIR);

if(!fs.existsSync(DATA_DIR)){ //if there isn't currently a folder that exists then create a folder for the Data. 
    fs.mkdirSync(DATA_DIR)
}

//Create paths to the json and csv files 
const WEATHER_FILE = path.join(DATA_DIR, 'weather.json')
const LOG_FILE = path.join(DATA_DIR,'weather_log.csv')

//call API key from dot env
export async function fetchWeather() {
    const apiKey = process.env.WEATHER_API_KEY
    const city = process.env.city || 'London'
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    try{
        const  response = await fetch(url)
        if(!response.ok){
            throw new Error(`HTTP Error! Status ${response.status}`)
        }

        const data = await response.json()
        const nowUTC = new Date().toISOString()
        data.last_updated_utc = nowUTC
        fs.writeFileSync(WEATHER_FILE,JSON.stringify(data,null,2))

        const header = 'timestamp,city,temperature,description\n'
        if (!fs.existsSync(LOG_FILE)) { 
            fs.writeFileSync(LOG_FILE,header)
        } else {
            const firstLine = fs.readFileSync(LOG_FILE, 'utf8').split('\n')[0]
            if(firstLine!== 'timestamp,city,temperature,description'){
                fs.writeFileSync(LOG_FILE,header + fs.readFileSync(LOG_FILE,'utf8'))
            }
        }
        const logEntry = `${nowUTC},${city},${data.main.temp},${data.weather[0].description}\n`
        fs.appendFileSync(LOG_FILE,logEntry)
        console.log(`Weather data updated for ${city} at ${nowUTC}`);       
    }catch(err){
        console.log(`Error fetching the weather:`, err);
    }
}

//file path of js that node is currently executing
//controls when you run the commands
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    fetchWeather();
}
/* if(import.meta.filename === `file://${process.argv[1]}`){
    fetchWeather()
} 
*/

