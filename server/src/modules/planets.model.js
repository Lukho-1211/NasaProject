const fs = require('fs');
const path = require('path');
const parse = require('csv-parse').parse;

const planets = require('./planets.mongo');

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
        .on('data', async (data)=>{
            if(isHabitablePlanets(data)){
                await savePlanet(data);
            }
        })
        .on('error', (err)=>{ 
            console.log(err);
            reject(err)
        })
        .on('end', async()=>{ 
            const countPlanetsFound = (await getAllPlanets()).length;
            console.log(`${countPlanetsFound} habitable planet found!`);// prints converted RAW data to js 
            resolve();
        });  
    });    
  }

 async function getAllPlanets(){
    return await planets.find({},{
            '_id': 0, '__v': 0,
        });
}

async function savePlanet(planet){
        try{
            await planets.updateOne({
                keplerName: planet.kepler_name,//create this
            },
            {
                keplerName: planet.kepler_name,//when already exist update
            },
            {
                upsert: true,//set it to true
            });
        }catch(err){
            console.log(`Could not save a planet ${err}`);
        }
    }

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}