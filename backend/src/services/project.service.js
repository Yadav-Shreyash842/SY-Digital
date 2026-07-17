const Project = require("../models/Project");
const slugify = require("../helpers/slugify");
const ApiError = require("../utils/ApiError");

const createProject = async (projectData, userId) => {

    const slug = slugify(projectData.title);

    const existingProject = await Project.findOne({ slug });

    if (existingProject) {
        throw new ApiError(
            409,
            "Project already exists"
        );
    }

    const project = await Project.create({

        ...projectData,

        slug,

        createdBy: userId,

    });

    return project;

};


const getAllProjects = async (query) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Search
    if (query.search) {
        filter.title = {
            $regex: query.search,
            $options: "i",
        };
    }

    // Category
    if (query.category) {
        filter.category = query.category;
    }

    // Status
    if (query.status) {
        filter.status = query.status;
    }

    // Featured
    if (query.featured !== undefined) {
        filter.isFeatured = query.featured === "true";
    }

    // Sorting
    let sort = { createdAt: -1 };

    switch (query.sort) {

        case "title":
            sort = { title: 1 };
            break;

        case "oldest":
            sort = { createdAt: 1 };
            break;

        case "newest":
            sort = { createdAt: -1 };
            break;

        case "completed":
            sort = { completionDate: -1 };
            break;

    }

    const totalItems = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    return {

        projects,

        pagination: {

            page,

            limit,

            totalItems,

            totalPages: Math.ceil(totalItems / limit),

        },

    };

};


const getProjectBySlug = async (slug) => {

    const project = await Project.findOne({
        slug,
    });

    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        );
    }

    return project;

};

const updateProject = async (projectId, updateData) => {

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
        });

        if (existingProject) {
            throw new ApiError(
                409,
                "Project title already exists"
            );
        }

        updateData.slug = slug;
    }

    Object.assign(project, updateData);

    await project.save();

    return project;
};

const deleteProject = async (projectId) => {

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(
            404,
            "Project not found"
        );
    }

    await Project.findByIdAndDelete(projectId);

    return project;

};

const getFeaturedProjects = async () => {

    const projects = await Project.find({

        isFeatured: true,

        status: "published",

    }).sort({

        createdAt: -1,

    });

    return projects;

};


module.exports = {
    createProject,
    getAllProjects,
    getFeaturedProjects,
    getProjectBySlug,
    updateProject,
    deleteProject,
};
    