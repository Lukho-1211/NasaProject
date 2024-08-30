const {getAllPlanets} = require('../../modules/planets.model');

async function HttpGetAllPlanets(req,res){
    return res.status(200).json(await getAllPlanets());
}


module.exports = {
    HttpGetAllPlanets,
};