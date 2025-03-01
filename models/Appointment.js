const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    name: String,
    phone: String,
    date: String,
    time: String,
    status: { type: String, default: "Scheduled" }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
