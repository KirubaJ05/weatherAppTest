import express from 'express'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
//reads csv files and turns it into a js object
import csv from 'csv-parser'

dotenv.config()
const app = express()
const port = process.env.PORT || 5000

const DATA_DIR = path.join(import.meta.dirname, 'data')
const WEATHER_FILE = path.join(DATA_DIR,'weather.json')
const LOG_FILE = path.join(DATA_DIR,'weather_log.csv')

console.log(LOG_FILE);


app.use(express.static(path.join(import.meta.dirname, 'public')))

app.get('/api/weather', (req,res) =>{
    if(!fs.existsSync(WEATHER_FILE)){
        return res.status(404).json({error: 'No Weather Available'})
    }

    try{
        const weatherData = JSON.parse(fs.readFileSync(WEATHER_FILE,'utf8'))
        res.json(weatherData)

    }catch(err) {

        console.log('Error reading weather.json',err);
        res.status(500).json({error: 'Failed to read weather Data'})

    }
})

app.get('/api/weather-log', (req,res) => {
    if(!fs.existsSync(LOG_FILE)){
        return res.status(404).json({error: 'No Weather Log Available'})
    }
    const timestamps = []
    const temps = []

    fs.createReadStream(LOG_FILE) //opening csv file so that we can read it line by line
        .pipe(csv())
        .on('data', row => {
            if(row.timestamp && row.temperature){
                timestamps.push(row.timestamp)
                temps.push(parseFloat(row.temperature))
            }
        })
        .on('end', () => res.json({timestamps,temps}))
        .on('error', err => {
            console.log('Error reading CSV', err);
            res.status(500).json({error : 'Failed to read log'})
        })

})

app.listen(port , () => {
    console.log(`Server running on Port ${port}`);
})