const {getAllplanets} = require('../../modules/planets.model');

function HttpGetAllPlanets(req,res){
    return res.status(200).json(getAllplanets());
}


module.exports = {
    HttpGetAllPlanets,
};