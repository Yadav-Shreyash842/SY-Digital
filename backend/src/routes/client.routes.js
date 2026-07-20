const express = require("express");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const ROLES = require("../constants/roles");
const Meeting = require("../models/Meeting");
const Message = require("../models/Message");
const Payment = require("../models/Payment");
const Project = require("../models/Project");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { emitToAdmins } = require("../socket/socketEmitter");

const router = express.Router();

// All client routes require auth + client role
router.use(auth, authorize(ROLES.CLIENT));

// GET /api/client/meetings - client's own meetings
router.get("/meetings", async (req, res, next) => {
    try {
        const meetings = await Meeting.find({ email: req.user.email })
            .populate("service", "title")
            .sort({ meetingDate: -1 });

        return res.status(200).json(
            new ApiResponse(200, "Meetings fetched successfully", meetings)
        );
    } catch (error) {
        next(error);
    }
});

// GET /api/client/messages - client's own messages
router.get("/messages", async (req, res, next) => {
    try {
        const messages = await Message.find({ email: req.user.email })
            .populate("service", "title")
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, "Messages fetched successfully", messages)
        );
    } catch (error) {
        next(error);
    }
});

// POST /api/client/messages - client sends a new message
router.post("/messages", async (req, res, next) => {
    try {
        const { subject, message, service } = req.body;

        if (!subject || !message) {
            throw new ApiError(400, "Subject and message are required");
        }

        const newMessage = await Message.create({
            name: `${req.user.firstName} ${req.user.lastName}`,
            email: req.user.email,
            subject,
            message,
            service: service || undefined,
            status: "unread",
        });

        await newMessage.populate("service", "title");

        try {
            emitToAdmins("newMessage", { message: newMessage });
        } catch (err) {
            // socket is best-effort
        }

        return res.status(201).json(
            new ApiResponse(201, "Message sent successfully", newMessage)
        );
    } catch (error) {
        next(error);
    }
});

// GET /api/client/payments - client's own payments
router.get("/payments", async (req, res, next) => {
    try {
        const payments = await Payment.find({ clientEmail: req.user.email })
            .populate("meeting", "meetingDate meetingTime")
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, "Payments fetched successfully", payments)
        );
    } catch (error) {
        next(error);
    }
});

// GET /api/client/projects - client's own projects
router.get("/projects", async (req, res, next) => {
    try {
        const projects = await Project.find({
            $or: [
                { clientName: req.user.firstName + " " + req.user.lastName },
                { clientName: req.user.email },
            ],
        }).sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, "Projects fetched successfully", projects)
        );
    } catch (error) {
        next(error);
    }
});

// GET /api/client/dashboard - aggregated dashboard data
router.get("/dashboard", async (req, res, next) => {
    try {
        const email = req.user.email;
        const fullName = `${req.user.firstName} ${req.user.lastName}`;
        const ProjectRequest = require("../models/ProjectRequest");

        const [meetings, messages, payments, projects, projectRequests] = await Promise.all([
            Meeting.find({ email }).populate("service", "title").sort({ meetingDate: -1 }),
            Message.find({ email }).populate("service", "title").sort({ createdAt: -1 }),
            Payment.find({ clientEmail: email }).populate("meeting", "meetingDate meetingTime").sort({ createdAt: -1 }),
            Project.find({ $or: [{ clientName: fullName }, { clientName: email }] }).sort({ createdAt: -1 }),
            ProjectRequest.find({ clientEmail: email }).populate("projectId", "title status slug").sort({ createdAt: -1 }),
        ]);

        return res.status(200).json(
            new ApiResponse(200, "Dashboard data fetched successfully", {
                meetings,
                messages,
                payments,
                projects,
                projectRequests,
            })
        );
    } catch (error) {
        next(error);
    }
});

// PATCH /api/client/messages/:id/reply - client reply to their own message
router.patch("/messages/:id/reply", async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            throw new ApiError(404, "Message not found");
        }

        if (message.email !== req.user.email) {
            throw new ApiError(403, "You can only reply to your own messages");
        }

        message.clientReplies.push({ text: req.body.text });
        await message.save();
        await message.populate("service", "title");

        try {
            emitToAdmins("clientReplied", { message });
        } catch (err) {
            // socket is best-effort
        }

        return res.status(200).json(
            new ApiResponse(200, "Reply sent successfully", message)
        );
    } catch (error) {
        next(error);
    }
});

// GET /api/client/project-requests - client's own project requests
router.get("/project-requests", async (req, res, next) => {
    try {
        const ProjectRequest = require("../models/ProjectRequest");
        const requests = await ProjectRequest.find({ clientEmail: req.user.email })
            .populate("projectId", "title status slug")
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, "Project requests fetched successfully", requests)
        );
    } catch (error) {
        next(error);
    }
});

// POST /api/client/project-requests - client creates a project request
router.post("/project-requests", async (req, res, next) => {
    try {
        const { title, description, category, budget, timeline } = req.body;

        if (!title || !description || !category) {
            throw new ApiError(400, "Title, description, and category are required");
        }

        const ProjectRequest = require("../models/ProjectRequest");
        const projectRequest = await ProjectRequest.create({
            clientName: `${req.user.firstName} ${req.user.lastName}`,
            clientEmail: req.user.email,
            title,
            description,
            category,
            budget: budget || 0,
            timeline: timeline || "",
        });

        try {
            const { emitToAdmins } = require("../socket/socketEmitter");
            emitToAdmins("newProjectRequest", { request: projectRequest });
        } catch (err) {
            // socket is best-effort
        }

        return res.status(201).json(
            new ApiResponse(201, "Project request submitted successfully", projectRequest)
        );
    } catch (error) {
        next(error);
    }
});

module.exports = router;
