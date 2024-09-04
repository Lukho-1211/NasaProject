const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://NasaForEveryOne:PasswordNasa@nodefirst.nzhuexo.mongodb.net/NasaDataBaseProject?retryWrites=true&w=majority&appName=nodefirst';

mongoose.connection.once('open', ()=>{
    console.log('MangoDB connected...');
});
mongoose.connection.on('error', (err)=>{
    console.error(err);
});

async function mongoConnect() {
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}


module.exports = { 
    mongoConnect,
    mongoDisconnect
}