const ProjectRequest = require("../models/ProjectRequest");
const Project = require("../models/Project");
const Message = require("../models/Message");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../middlewares/logger");

const VALID_STATUSES = ["pending", "reviewing", "approved", "rejected"];

const create = async (req, res, next) => {
    try {
        const { title, description, category, budget, timeline } = req.body;

        if (!title || !description || !category) {
            throw new ApiError(400, "Title, description, and category are required");
        }

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
            logger.warn(`[Socket.IO] ${err.message}`);
        }

        return res.status(201).json(
            new ApiResponse(201, "Project request submitted successfully", projectRequest)
        );
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;

        const filter = {};
        if (status && VALID_STATUSES.includes(status)) {
            filter.status = status;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { clientName: { $regex: search, $options: "i" } },
                { clientEmail: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        const [requests, total] = await Promise.all([
            ProjectRequest.find(filter)
                .populate("projectId", "title status slug")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            ProjectRequest.countDocuments(filter),
        ]);

        return res.status(200).json(
            new ApiResponse(200, "Project requests fetched successfully", requests, {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            })
        );
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const projectRequest = await ProjectRequest.findById(req.params.id).populate("projectId", "title status slug");

        if (!projectRequest) {
            throw new ApiError(404, "Project request not found");
        }

        return res.status(200).json(
            new ApiResponse(200, "Project request fetched successfully", projectRequest)
        );
    } catch (error) {
        next(error);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const { status, adminNotes } = req.body;

        if (!status || !VALID_STATUSES.includes(status)) {
            throw new ApiError(400, `Status must be one of: ${VALID_STATUSES.join(", ")}`);
        }

        const projectRequest = await ProjectRequest.findById(req.params.id);

        if (!projectRequest) {
            throw new ApiError(404, "Project request not found");
        }

        projectRequest.status = status;
        if (adminNotes !== undefined) {
            projectRequest.adminNotes = adminNotes;
        }
        await projectRequest.save();

        if (status === "approved") {
            try {
                const slug = projectRequest.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");

                const existingSlug = await Project.findOne({ slug });
                const uniqueSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

                const project = await Project.create({
                    title: projectRequest.title,
                    slug: uniqueSlug,
                    shortDescription: projectRequest.description.substring(0, 250),
                    description: projectRequest.description,
                    category: projectRequest.category,
                    clientName: projectRequest.clientName,
                    status: "draft",
                    createdBy: req.user._id,
                });

                projectRequest.projectId = project._id;
                await projectRequest.save();

                try {
                    await Message.create({
                        name: "System",
                        email: projectRequest.clientEmail,
                        subject: `Project Approved: ${projectRequest.title}`,
                        message: `Congratulations! Your project "${projectRequest.title}" has been approved. Our team has started working on it. You can use this thread to communicate with the team about any updates, questions, or requirements.`,
                        status: "unread",
                        repliedBy: req.user._id,
                    });
                } catch (msgErr) {
                    logger.warn(`[ProjectRequest] Welcome message creation failed: ${msgErr.message}`);
                }
            } catch (err) {
                logger.warn(`[ProjectRequest] Auto-create project failed: ${err.message}`);
            }
        }

        try {
            const { emitToAdmins, emitToClient } = require("../socket/socketEmitter");
            const User = require("../models/User");

            emitToAdmins("projectRequestUpdated", { request: projectRequest });

            const clientUser = await User.findOne({ email: projectRequest.clientEmail }).select("_id");
            if (clientUser) {
                emitToClient(clientUser._id.toString(), "projectRequestUpdated", { request: projectRequest });
            }
        } catch (err) {
            logger.warn(`[Socket.IO] ${err.message}`);
        }

        return res.status(200).json(
            new ApiResponse(200, "Project request status updated successfully", projectRequest)
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    updateStatus,
};
