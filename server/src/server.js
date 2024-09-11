const http = require("http");
require('dotenv').config();

const app = require('./app');
const { mongoConnect } = require('./services/monogo');
const { loadPlanetsData } = require('./modules/planets.model');
const { loadLaunchData } = require('./modules/launches.model');


const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
                            //when using files/streams its very importend for 
async function startServer(){//a file to load all its info before the server starts   
    await mongoConnect();

    await loadPlanetsData(); //first complete reading before the server starts
    await loadLaunchData();

   
    server.listen(PORT, ()=>{
        console.log(`Listerning to port ${PORT}...`);
    });
}

startServer();// starting the server