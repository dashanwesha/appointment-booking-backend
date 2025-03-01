const express = require("express");
const Appointment = require("../models/Appointment");
const router = express.Router();

// Book an appointment
router.post("/book", async (req, res) => {
    try {
        const { name, phone, date, time } = req.body;
        console.log("Booking data:", { name, phone, date, time });

        if (!name || !phone || !date || !time) {
            return res.status(400).json({ message: "❌ All fields (name, phone, date, time) are required." });
        }

        const currentDate = new Date();
        const appointmentDate = new Date(`${date}T${time}`);

        const minDate = new Date();
        minDate.setDate(currentDate.getDate() + 15);
        console.log(appointmentDate, currentDate);

        if (appointmentDate < currentDate) {
            return res.status(400).json({ message: "❌ You cannot book an appointment in the past." });
        }

        if (appointmentDate > minDate) {
            return res.status(400).json({ message: "❌ Appointments can only be booked within the next 15 days." });
        }

        // Create a new appointment
        const newAppointment = new Appointment({ name, phone, date, time });
        await newAppointment.save();

        // Return the newly created appointment
        res.status(201).json({ 
            message: "✅ Appointment booked successfully", 
            appointment: newAppointment 
        });

    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "❌ Error booking appointment" });
    }
});

// Get all appointments
router.get("/appointments", async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "❌ Error fetching appointments" });
    }
});

// Cancel an appointment
router.delete("/appointments/:id", async (req, res) => {
    try {
        const appointmentId = req.params.id;

        // Use _id for MongoDB deletion
        await Appointment.deleteOne({ _id: appointmentId });

        res.status(200).json({ message: "✅ Appointment canceled successfully" });
    } catch (error) {
        console.error("Error canceling appointment:", error);
        res.status(500).json({ message: "❌ Error canceling appointment" });
    }
});

module.exports = router;
