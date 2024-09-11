const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber:{ 
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String,
        required: true,
    },       //used to also connect 
    target: {//to the other collection/ Table
        type: String
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true,
    },
});

module.exports = mongoose.model('Launch', launchesSchema);