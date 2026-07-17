const Service = require("../models/Service");
const slugify = require("../helpers/slugify");
const ApiError = require("../utils/ApiError");

const createService = async (serviceData, userId) => {

    const slug = slugify(serviceData.title);

    const existingService = await Service.findOne({ slug });

    if (existingService) {
        throw new ApiError(
            409,
            "Service already exists"
        );
    }

    const service = await Service.create({

        ...serviceData,

        slug,

        createdBy: userId,

    });

    return service;

};


const getAllServices = async (query) => {

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

    // Price Range
    if (query.minPrice || query.maxPrice) {

        filter.price = {};

        if (query.minPrice) {
            filter.price.$gte = Number(query.minPrice);
        }

        if (query.maxPrice) {
            filter.price.$lte = Number(query.maxPrice);
        }

    }

    // Sorting
    let sort = { createdAt: -1 };

    switch (query.sort) {

        case "price-low":
            sort = { price: 1 };
            break;

        case "price-high":
            sort = { price: -1 };
            break;

        case "oldest":
            sort = { createdAt: 1 };
            break;

        case "newest":
            sort = { createdAt: -1 };
            break;

        case "title":
            sort = { title: 1 };
            break;

    }

    const totalItems = await Service.countDocuments(filter);

    const services = await Service.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

    return {

        services,

        pagination: {

            page,

            limit,

            totalItems,

            totalPages: Math.ceil(totalItems / limit),

        },

    };

};


const getServiceBySlug = async (slug) => {

    const service = await Service.findOne({
        slug,
    });

    if (!service) {
        throw new ApiError(
            404,
            "Service not found"
        );
    }

    return service;

};

const updateService = async (serviceId, updateData) => {

    const service = await Service.findById(serviceId);

    if (!service) {
        throw new ApiError(
            404,
            "Service not found"
        );
    }

    // Update Slug if Title Changes
    if (
        updateData.title &&
        updateData.title !== service.title
    ) {

        const slug = slugify(updateData.title);

        const existingService = await Service.findOne({
            slug,
            _id: { $ne: serviceId },
        });

        if (existingService) {
            throw new ApiError(
                409,
                "Service title already exists"
            );
        }

        updateData.slug = slug;
    }

    Object.assign(service, updateData);

    await service.save();

    return service;

};


const deleteService = async (serviceId) => {

    const service = await Service.findById(serviceId);

    if (!service) {
        throw new ApiError(
            404,
            "Service not found"
        );
    }

    await Service.findByIdAndDelete(serviceId);

    return service;

};


const getFeaturedServices = async () => {

    const services = await Service.find({

        isFeatured: true,

        status: "published",

    })
        .sort({ createdAt: -1 });

    return services;

};

module.exports = {
    createService,
    getAllServices,
    getServiceBySlug,
    updateService,
    deleteService,
    getFeaturedServices,
};

  


