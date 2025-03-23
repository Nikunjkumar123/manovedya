import express from "express"
const router = express.Router();
import Consultation from '../models/ConsultWithDoctor.js'
import { sendThankYouForBookingConsultation } from '../middleware/mail.js'
// Create a new consultation
router.post("/create-consultation", async (req, res) => {
    try {
        const { patientName, concernChallenge, email, phone, scheduleCalendar, scheduleTime, chooseDoctor, payment_id } = req.body;


        const newConsultation = new Consultation({
            patientName,
            concernChallenge,
            email,
            phone,
            scheduleCalendar,
            scheduleTime,
            chooseDoctor,
            payment_id,
        });

        const consultation = await newConsultation.save();
        sendThankYouForBookingConsultation(consultation)

        res.status(201).json({ status: true, message: "Consultation created successfully!", consultation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Error creating consultation", error: error.message });
    }
});

// Get all consultations
router.get("/all-consultation", async (req, res) => {
    try {
        const consultations = await Consultation.find();
        res.status(200).json({ status: true, consultations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching consultations", error: error.message });
    }
});

// Get a specific consultation by ID
router.get("/:id", async (req, res) => {
    try {
        const consultation = await Consultation.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        res.status(200).json({ data: consultation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching consultation", error: error.message });
    }
});

// Update a consultation
router.put("/:id", async (req, res) => {
    try {
        const { patientName, concernChallenge, email, phone, scheduleCalendar, scheduleTime, chooseDoctor, payment_id } = req.body;

        const updatedConsultation = await Consultation.findByIdAndUpdate(
            req.params.id,
            { patientName, concernChallenge, email, phone, scheduleCalendar, scheduleTime, chooseDoctor, payment_id },
            { new: true }
        );

        if (!updatedConsultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }

        res.status(200).json({ message: "Consultation updated successfully", data: updatedConsultation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating consultation", error: error.message });
    }
});

// Delete a consultation
router.get("/delete-consultation/:id", async (req, res) => {
    try {
        const consultation = await Consultation.findByIdAndDelete(req.params.id);
        if (!consultation) {
            return res.status(404).json({ status: false, message: "Consultation not found" });
        }
        res.status(200).json({ status: true, message: "Consultation deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting consultation", error: error.message });
    }
});

export default router;
