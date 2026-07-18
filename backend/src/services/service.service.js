const mongoose = require("mongoose");
const Service = require("../models/Service");
const slugify = require("../helpers/slugify");
const ApiError = require("../utils/ApiError");

const assertValidServiceId = (serviceId) => {
    if (!mongoose.isValidObjectId(serviceId)) {
        throw new ApiError(400, "Invalid service ID");
    }
};
const SERVICE_SELECT = [
    "title",
    "slug",
    "shortDescription",
    "description",
    "category",
    "price",
    "discountPrice",
    "duration",
    "technologies",
    "features",
    "image",
    "isFeatured",
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

const parseNumber = (value) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
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

const buildServiceFilter = (query = {}) => {
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

    const minPrice = parseNumber(query.minPrice);
    const maxPrice = parseNumber(query.maxPrice);

    if (minPrice !== null || maxPrice !== null) {
        filter.price = {};

        if (minPrice !== null) {
            filter.price.$gte = minPrice;
        }

        if (maxPrice !== null) {
            filter.price.$lte = maxPrice;
        }
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

const buildServiceSort = (sortKey) => {
    switch (sortKey) {
        case "price-low":
            return { price: 1 };

        case "price-high":
            return { price: -1 };

        case "oldest":
            return { createdAt: 1 };

        case "updated":
            return { updatedAt: -1 };

        case "title":
            return { title: 1 };

        case "newest":
        default:
            return { createdAt: -1 };
    }
};

const createService = async (serviceData, userId) => {

    const slug = slugify(serviceData.title);

    const existingService = await Service.findOne({ slug })
        .select("_id")
        .lean();

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

    const page = parsePage(query.page);
    const limit = parseLimit(query.limit);
    const skip = (page - 1) * limit;
    const filter = buildServiceFilter(query);
    const sort = buildServiceSort(query.sort);

    const [totalItems, services] = await Promise.all([
        Service.countDocuments(filter),
        Service.find(filter)
            .select(SERVICE_SELECT)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
    ]);

    return {

        services,

        pagination: {

            page,

            limit,

            totalItems,

            totalPages: Math.max(1, Math.ceil(totalItems / limit)),

        },

    };

};


const getServiceBySlug = async (slug) => {

    const service = await Service.findOne({
        slug,
    })
        .select(SERVICE_SELECT)
        .lean();

    if (!service) {
        throw new ApiError(
            404,
            "Service not found"
        );
    }

    return service;

};

const updateService = async (serviceId, updateData) => {

    assertValidServiceId(serviceId);

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
        })
            .select("_id")
            .lean();

        if (existingService) {
            throw new ApiError(
                409,
                "Service title already exists"
            );
        }

        updateData.slug = slug;
    }

    const allowedFields = [
        "title",
        "shortDescription",
        "description",
        "category",
        "price",
        "discountPrice",
        "duration",
        "technologies",
        "features",
        "image",
        "isFeatured",
        "status",
        "slug",
    ];

    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
            service[field] = updateData[field];
        }
    });

    await service.save();

    return service;

};


const deleteService = async (serviceId) => {

    assertValidServiceId(serviceId);

    const service = await Service.findByIdAndDelete(serviceId);

    if (!service) {
        throw new ApiError(
            404,
            "Service not found"
        );
    }

    return service;

};


const getFeaturedServices = async () => {

    const services = await Service.find({

        isFeatured: true,

        status: "published",

    })
        .select(SERVICE_SELECT)
        .sort({ createdAt: -1 })
        .lean();

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
