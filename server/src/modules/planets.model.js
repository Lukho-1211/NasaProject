const fs = require('fs');
const path = require('path');
const parse = require('csv-parse').parse;

const habitablePlanets = [];

function isHabitablePlanets(planet){
    return planet['koi_disposition'] === 'CONFIRMED'
      && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
      && planet['koi_prad'] < 1.6;
}

function loadPlanetsData(){
   return new Promise((resolve, reject)=>{
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))//RAW data
        .pipe(parse({//conecting and converting raw data to a readable information  
            comment: '#',
            columns: true,
        }))
        .on('data', (data)=>{
            if(isHabitablePlanets(data)){
                habitablePlanets.push(data);// RAW data
            }
        })
        .on('error', (err)=>{
            console.log(err);
            reject(err)
        })
        .on('end',()=>{
            console.log(`${habitablePlanets.length} habitable planet found`);// prints converted RAW data to js 
            resolve();
        });  
    });    
  }

function getAllplanets(){
    return habitablePlanets
}

module.exports = {
    loadPlanetsData,
    getAllplanets,
}