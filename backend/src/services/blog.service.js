const mongoose = require("mongoose");

const Blog = require("../models/Blog");
const slugify = require("../helpers/slugify");
const ApiError = require("../utils/ApiError");

// ─── Constants ────────────────────────────────────────────────────────────────

// Excludes "content" — never fetch the full blog body on listing endpoints
const BLOG_SELECT = [
    "title",
    "slug",
    "shortDescription",
    "featuredImage",
    "category",
    "tags",
    "author",
    "readTime",
    "views",
    "isFeatured",
    "status",
    "publishedAt",
    "createdBy",
    "createdAt",
    "updatedAt",
].join(" ");

const MAX_LIMIT = 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;

    return null;
};

const assertValidBlogId = (blogId) => {
    if (!mongoose.isValidObjectId(blogId)) {
        throw new ApiError(400, "Invalid blog ID");
    }
};

const buildBlogFilter = (query = {}) => {
    const filter = {};

    if (query.search) {
        const search = escapeRegex(query.search.trim());

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { shortDescription: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
            ];
        }
    }

    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.tag) filter.tags = query.tag;
    if (query.author) filter.author = query.author;

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

const buildBlogSort = (sortKey) => {
    switch (sortKey) {
        case "title":
            return { title: 1 };

        case "oldest":
            return { createdAt: 1 };

        case "views":
            return { views: -1 };

        case "readTime":
            return { readTime: 1 };

        case "published":
            return { publishedAt: -1 };

        case "updated":
            return { updatedAt: -1 };

        case "newest":
        default:
            return { createdAt: -1 };
    }
};

// ─── Service Functions ────────────────────────────────────────────────────────

const createBlog = async (blogData, userId) => {
    const slug = slugify(blogData.title.trim());

    const existingBlog = await Blog.findOne({ slug: slug.trim() })
        .select("_id")
        .lean();

    if (existingBlog) {
        throw new ApiError(409, "Blog already exists");
    }

    // Explicit whitelist — prevents mass assignment of views, createdBy, publishedAt
    const allowedFields = [
        "title",
        "shortDescription",
        "content",
        "featuredImage",
        "category",
        "tags",
        "author",
        "readTime",
        "seoTitle",
        "seoDescription",
        "isFeatured",
        "status",
    ];

    const sanitizedData = {};

    allowedFields.forEach((field) => {
        if (blogData[field] !== undefined) {
            sanitizedData[field] = blogData[field];
        }
    });

    if (sanitizedData.status === "published" && !blogData.publishedAt) {
        sanitizedData.publishedAt = new Date();
    }

    const blog = await Blog.create({
        ...sanitizedData,
        slug,
        createdBy: userId,
    });

    return blog.toJSON();
};

const getAllBlogs = async (query) => {
    const page = parsePage(query.page);
    const limit = parseLimit(query.limit);
    const skip = (page - 1) * limit;
    const filter = buildBlogFilter(query);
    const sort = buildBlogSort(query.sort);

    const [totalItems, blogs] = await Promise.all([
        Blog.countDocuments(filter),
        Blog.find(filter)
            .select(BLOG_SELECT)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
    ]);

    return {
        blogs,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages: Math.max(1, Math.ceil(totalItems / limit)),
        },
    };
};

const getBlogBySlug = async (slug) => {
    // findOneAndUpdate is intentional — atomically increments views and returns updated doc
  const blog = await Blog.findOneAndUpdate(
    {
        slug: slug.trim(),
        status: "published",
    },
    { $inc: { views: 1 } },
    { new: true }
).lean();

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return blog;
};

const updateBlog = async (blogId, updateData) => {
    assertValidBlogId(blogId);

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    // Update slug if title changes
    if (updateData.title && updateData.title !== blog.title) {
        const slug = slugify(updateData.title.trim());

        const existingBlog = await Blog.findOne({
            slug: slug.trim(),
            _id: { $ne: blogId },
        })
            .select("_id")
            .lean();

        if (existingBlog) {
            throw new ApiError(409, "Blog title already exists");
        }

        updateData.slug = slug;
    }

    // Set published date only on first-time publish — never overwrite an existing publishedAt
    if (
        blog.status !== "published" &&
        updateData.status === "published" &&
        !blog.publishedAt
    ) {
        updateData.publishedAt = new Date();
    }

    // Explicit whitelist — prevents mass assignment of views, createdBy
    const allowedFields = [
        "title",
        "shortDescription",
        "content",
        "featuredImage",
        "category",
        "tags",
        "author",
        "readTime",
        "seoTitle",
        "seoDescription",
        "isFeatured",
        "status",
        "publishedAt",
        "slug",
    ];

    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
            blog[field] = updateData[field];
        }
    });

    await blog.save();

    return blog.toJSON();
};

const deleteBlog = async (blogId) => {
    assertValidBlogId(blogId);

    // Single query — findByIdAndDelete returns the deleted doc or null
    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    return blog;
};

const getFeaturedBlogs = async () => {
    const blogs = await Blog.find({
        isFeatured: true,
        status: "published",
    })
        .select(BLOG_SELECT)
        .sort({ publishedAt: -1 })
        .lean();

    return blogs;
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    getFeaturedBlogs,
};
