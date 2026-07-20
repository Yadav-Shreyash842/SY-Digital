const mongoose = require("mongoose");
const Project = require("../models/Project");
const slugify = require("../helpers/slugify");
const ApiError = require("../utils/ApiError");

const assertValidProjectId = (projectId) => {
    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID");
    }
};
const PROJECT_SELECT = [
    "title",
    "slug",
    "shortDescription",
    "description",
    "category",
    "clientName",
    "technologies",
    "images",
    "video",
    "githubUrl",
    "liveUrl",
    "completionDate",
    "isFeatured",
    "revenue",
    "status",
    "createdBy",
    "createdAt",
    "updatedAt",
].join(" ");

const MAX_LIMIT = 100;

const escapeRegex = (value = "") => {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const parsePage = (value) => {
    const parsed = Number.parseInt(value, 10);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const parseLimit = (value) => {
    const parsed = Number.parseInt(value, 10);

    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 10;
    }

    return Math.min(parsed, MAX_LIMIT);
};

const parseBoolean = (value) => {
    if (value === true || value === "true") {
        return true;
    }

    if (value === false || value === "false") {
        return false;
    }

    return null;
};

const buildProjectFilter = (query = {}) => {
    const filter = {};

    if (query.search) {
        const search = escapeRegex(query.search.trim());

        if (search) {
            filter.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    clientName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    shortDescription: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }
    }

    if (query.category) {
        filter.category = query.category;
    }

    if (query.status) {
        filter.status = query.status;
    }

    const featured = parseBoolean(query.featured);

    if (featured !== null) {
        filter.isFeatured = featured;
    }

    if (query.startDate || query.endDate) {
        filter.createdAt = {};

        if (query.startDate) {
            const startDate = new Date(query.startDate);

            if (!Number.isNaN(startDate.getTime())) {
                filter.createdAt.$gte = startDate;
            }
        }

        if (query.endDate) {
            const endDate = new Date(query.endDate);

            if (!Number.isNaN(endDate.getTime())) {
                filter.createdAt.$lte = endDate;
            }
        }

        if (Object.keys(filter.createdAt).length === 0) {
            delete filter.createdAt;
        }
    }

    return filter;
};

const buildProjectSort = (sortKey) => {
    switch (sortKey) {
        case "title":
            return { title: 1 };

        case "oldest":
            return { createdAt: 1 };

        case "updated":
            return { updatedAt: -1 };

        case "completed":
            return { completionDate: -1 };

        case "newest":
        default:
            return { createdAt: -1 };
    }
};

const createProject = async (projectData, userId) => {

    const baseSlug = slugify(projectData.title);

    let slug = baseSlug;
    let counter = 1;

    while (await Project.findOne({ slug }).select("_id").lean()) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    const project = await Project.create({
        ...projectData,
        slug,
        createdBy: userId,
    });

    return project;
};


const getAllProjects = async (query) => {

    const page = parsePage(query.page);
    const limit = parseLimit(query.limit);
    const skip = (page - 1) * limit;
    const filter = buildProjectFilter(query);
    const sort = buildProjectSort(query.sort);

    const [totalItems, projects] = await Promise.all([
        Project.countDocuments(filter),
        Project.find(filter)
            .select(PROJECT_SELECT)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
    ]);

    return {

        projects,

        pagination: {

            page,

            limit,

            totalItems,

            totalPages: Math.max(1, Math.ceil(totalItems / limit)),

        },

    };

};


const getProjectBySlug = async (slug) => {

    const project = await Project.findOne({
        slug,
    })
        .select(PROJECT_SELECT)
        .lean();

    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        );
    }

    return project;

};

const updateProject = async (projectId, updateData) => {

    assertValidProjectId(projectId);

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        );
    }

    // Update Slug if Title Changes
    if (
        updateData.title &&
        updateData.title !== project.title
    ) {

        const slug = slugify(updateData.title);

        const existingProject = await Project.findOne({
            slug,
            _id: { $ne: projectId },
        })
            .select("_id")
            .lean();

        if (existingProject) {
            throw new ApiError(
                409,
                "Project title already exists"
            );
        }

        updateData.slug = slug;
    }

    const allowedFields = [
        "title",
        "shortDescription",
        "description",
        "category",
        "clientName",
        "technologies",
        "images",
        "video",
        "githubUrl",
        "liveUrl",
        "completionDate",
        "isFeatured",
        "revenue",
        "status",
        "slug",
    ];

    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
            project[field] = updateData[field];
        }
    });

    await project.save();

    return project;
};

const deleteProject = async (projectId) => {

    assertValidProjectId(projectId);

    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        );
    }

    return project;

};

const getFeaturedProjects = async () => {

    const projects = await Project.find({

        isFeatured: true,

        status: "published",

    })
        .select(PROJECT_SELECT)
        .sort({

            createdAt: -1,

        })
        .lean();

    return projects;

};


const MAX_BULK_LIMIT = 50;

const bulkDeleteProjects = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Please provide project IDs to delete");
    }

    if (ids.length > MAX_BULK_LIMIT) {
        throw new ApiError(400, `Cannot delete more than ${MAX_BULK_LIMIT} projects at once`);
    }

    ids.forEach((id) => {
        if (!mongoose.isValidObjectId(id)) {
            throw new ApiError(400, `Invalid project ID: ${id}`);
        }
    });

    const result = await Project.deleteMany({ _id: { $in: ids } });

    return { deletedCount: result.deletedCount };
};

const bulkUpdateStatus = async (ids, status) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Please provide project IDs to update");
    }

    if (ids.length > MAX_BULK_LIMIT) {
        throw new ApiError(400, `Cannot update more than ${MAX_BULK_LIMIT} projects at once`);
    }

    const validStatuses = ["draft", "published", "archived"];

    if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    ids.forEach((id) => {
        if (!mongoose.isValidObjectId(id)) {
            throw new ApiError(400, `Invalid project ID: ${id}`);
        }
    });

    const result = await Project.updateMany(
        { _id: { $in: ids } },
        { $set: { status } }
    );

    return { updatedCount: result.modifiedCount, status };
};

const getProjectStats = async () => {
    const [
        totalProjects,
        publishedProjects,
        draftProjects,
        archivedProjects,
        featuredProjects,
        revenueResult,
    ] = await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ status: "published" }),
        Project.countDocuments({ status: "draft" }),
        Project.countDocuments({ status: "archived" }),
        Project.countDocuments({ isFeatured: true }),
        Project.aggregate([
            { $group: { _id: null, total: { $sum: "$revenue" } } },
        ]),
    ]);

    return {
        totalProjects,
        publishedProjects,
        draftProjects,
        archivedProjects,
        featuredProjects,
        totalRevenue: revenueResult[0]?.total || 0,
    };
};

module.exports = {
    createProject,
    getAllProjects,
    getFeaturedProjects,
    getProjectBySlug,
    updateProject,
    deleteProject,
    bulkDeleteProjects,
    bulkUpdateStatus,
    getProjectStats,
};
