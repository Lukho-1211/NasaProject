const launchesDataBase = require('./launches.mongo');
const planets = require('./planets.mongo');

//const launches = new Map();

const DEFUALT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Exploror IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-62 f',
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

//launches.set(launch.flightNumber, launch);

async function existsLaunchWithId(launchId){
    return await launchesDataBase.findOne({
        flightNumber: launchId,
    });
}

async function getLatestFlightNumber(){
    const lastestFlightNumber = await launchesDataBase.findOne()
    .sort('-flightNumber');

    if(!lastestFlightNumber){
        return DEFUALT_FLIGHT_NUMBER;
    }
    console.log(DEFUALT_FLIGHT_NUMBER);
    return lastestFlightNumber.flightNumber;

}

async function getAllLaunches(){
    return await launchesDataBase.find({},
        {'_id': 0, '__v': 0},
    );
}

async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet){
         throw new Error('No matching planets Found');
    }
    await launchesDataBase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    },launch, {
        upsert: true,
    });
}

async function scheduleLaunch(launch){
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
    existsLaunchWithId,
    getAllLaunches,
    scheduleLaunch,
    abortLaunchById,
}