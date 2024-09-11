const axios = require('axios');

const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');

//const launches = new Map();

const DEFUALT_FLIGHT_NUMBER = 100;

// const launch = {
//     flightNumber: 100, //flight_Number
//     mission: 'Kepler Exploration X', //name
//     rocket: 'Exploror IS1', //rocket.name
//     launchDate: new Date('December 27, 2030'), //date_local
//     target: 'Kepler-62 f', //not applicable
//     customers: ['ZTM', 'NASA'], //payload.customers for each payload
//     upcoming: true, //upcomming
//     success: true, //success
// };

// saveLaunch(launch);

const SPACEX_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches(){
    
    console.log('loading Launch data....');

    const respose = await axios.post(SPACEX_URL,{
        query: {},
        options: {
            
            pagination: false,
            populate: [
                {                   //this is how to select TABLES from 
                    path: 'rocket',// an extenal database / collection
                    select: {
                        name: 1
                    }
                },
                {                   ////select another TABLES for another field
                    path: 'payloads',//from an extenal database / collection
                    select:{
                        'customers': 1
                    }
                }
            ]
        }
    });

    if(respose.status !== 200){
        console.log('Problem downloading launch data');
        throw new Error('Launch data downloaded failed!');
    }

    const launchDocs = respose.data.docs;
    for(const launchDoc of launchDocs){

        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload)=>{
            return payload['customers'];
        })

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        };
        console.log(`${launch.flightNumber} ${launch.mission}`);
        await saveLaunch(launch);
    }
}

async function loadLaunchData(){
    const firstLaunch = await FindLaunch({
        flight_number: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });

    if(firstLaunch){
        console.log('Launch data already exist...');
    }else{
         await populateLaunches();
    }
}



async function FindLaunch(filter){
    return await launchesDataBase.findOne(filter);
}

async function existsLaunchWithId(launchId){
    return await FindLaunch({
        flightNumber: launchId,
    });
}

async function getLatestFlightNumber(){
    const lastestFlightNumber = await launchesDataBase.findOne()
    .sort('-flightNumber');

    if(!lastestFlightNumber){
        return DEFUALT_FLIGHT_NUMBER;
    }
    return lastestFlightNumber.flightNumber;
}

async function getAllLaunches(skip, limit){
    return await launchesDataBase.
        find({}, {'_id': 0, '__v': 0})
        .sort({ flightNumber: 1 })  //-1 will order the results discending
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch){
    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },launch, {
        upsert: true,
    });
}

async function scheduleLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet){
         throw new Error('No matching planets Found');
    }
    
    const newflightNumber = await getLatestFlightNumber() + 1;
    
    const newLaunch = Object.assign(launch,{
        success: true,
        upcoming: true,
        customers: ['Zero To Mastery', 'NASA'],
        flightNumber: newflightNumber,
    });

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId){
    const aborted = await launchesDataBase.updateOne({
        flightNumber: launchId,
    },{
        upcoming: false,
        success: false,
    });
    
    return aborted.modifiedCount ===1;

}

module.exports = {
    loadLaunchData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleLaunch,
    abortLaunchById,
}