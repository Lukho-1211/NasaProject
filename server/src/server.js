const http = require("http");
const { env } = require("process");

const app = require('./app');
const {mongoConnect} = require('./services/monogo');
const {loadPlanetsData} = require('./modules/planets.model');



const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){//when using files/streams its very importend for a file to load all its info before the server starts   
    await mongoConnect();

    await loadPlanetsData(); //first complete reading before the server starts

   
    server.listen(PORT, ()=>{
        console.log(`Listerning to port ${PORT}...`);
    });
}

startServer();// starting the server