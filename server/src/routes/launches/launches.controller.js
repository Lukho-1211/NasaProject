const {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById
} = require('../../modules/launches.model');


function httpGetAllLaunches(req, res){
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res){
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate){
        return res.status(400).json({
            error: 'Missing required launch properties',
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate)){ //isNaN means is not a number
        return res.status(400).json({
            error: 'Invalid launch date', 
        });
    }

    addNewLaunch(launch);

    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res){
    const launchId = Number(req.params.id);
    
    //first check if the Launch exist
    if(!existsLaunchWithId(launchId)){
        return res.status(400).json({
            error: 'Launch not found',
        });
    }
    

    //if Lauch exist
    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}