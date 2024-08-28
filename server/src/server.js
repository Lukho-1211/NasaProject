const http = require("http");
const { env } = require("process");
const mongoose = require('mongoose');

const app = require('./app');
const {loadPlanetsData} = require('./modules/planets.model')


const PORT = process.env.PORT || 8000;
const MONGO_URL = 'mongodb+srv://NasaForEveryOne:PasswordNasa@nodefirst.nzhuexo.mongodb.net/?retryWrites=true&w=majority&appName=nodefirst';

const server = http.createServer(app);

mongoose.connection.once('open', ()=>{
    console.log('MangoDB connected...');
});
mongoose.connection.on('error', (err)=>{
    console.error(err);
});

async function startServer(){//when using files/streams its very importend for a file to load all its info before the server starts
    await loadPlanetsData(); //first complete reading before the server starts
   
    await mongoose.connect(MONGO_URL);
   
    server.listen(PORT, ()=>{
        console.log(`Listerning to port ${PORT}...`);
    });
}

startServer();// starting the server