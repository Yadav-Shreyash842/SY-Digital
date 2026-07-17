const Blog = require("../models/Blog");
const slugify = require("../helpers/slugify");
const ApiError = require("../utils/ApiError");

const createBlog = async (blogData, userId) => {

    const slug = slugify(blogData.title);

    const existingBlog = await Blog.findOne({
        slug,
    });

    if (existingBlog) {

        throw new ApiError(
            409,
            "Blog already exists"
        );

    }

    if (
        blogData.status === "published" &&
        !blogData.publishedAt
    ) {

        blogData.publishedAt = new Date();

    }

    const blog = await Blog.create({

        ...blogData,

        slug,

        createdBy: userId,

    });

    return blog;

};

const getAllBlogs = async (query) => {

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

    // Tag Filter
    if (query.tag) {

        filter.tags = query.tag;

    }

    // Author
    if (query.author) {

        filter.author = query.author;

    }

    // Sorting
    let sort = {

        createdAt: -1,

    };

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

        case "views":

            sort = { views: -1 };

            break;

        case "readTime":

            sort = { readTime: 1 };

            break;

        case "published":

            sort = { publishedAt: -1 };

            break;

    }

    const totalItems = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)

        .sort(sort)

        .skip(skip)

        .limit(limit);

    return {

        blogs,

        pagination: {

            page,

            limit,

            totalItems,

            totalPages: Math.ceil(totalItems / limit),

        },

    };

};

const getBlogBySlug = async (slug) => {

    const blog = await Blog.findOneAndUpdate(
        {
            slug,
            status: "published",
        },
        {
            $inc: {
                views: 1,
            },
        },
        {
            new: true,
        }
    );

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found"
        );
    }

    return blog;

};

const updateBlog = async (blogId, updateData) => {

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(
            404,
            "Blog not found"
        );
    }

    // Update Slug
    if (
        updateData.title &&
        updateData.title !== blog.title
    ) {

        const slug = slugify(updateData.title);

        const existingBlog = await Blog.findOne({
            slug,
            _id: { $ne: blogId },
        });

        if (existingBlog) {
            throw new ApiError(
                409,
                "Blog title already exists"
            );
        }

        updateData.slug = slug;
    }

    // Set Published Date
    if (
        blog.status !== "published" &&
        updateData.status === "published"
    ) {

        updateData.publishedAt = new Date();

    }

    Object.assign(blog, updateData);

    await blog.save();

    return blog;

};

const deleteBlog = async (blogId) => {

    const blog = await Blog.findById(blogId);

    if (!blog) {

        throw new ApiError(
            404,
            "Blog not found"
        );

    }

    await Blog.findByIdAndDelete(blogId);

    return blog;

};

const getFeaturedBlogs = async () => {

    const blogs = await Blog.find({

        isFeatured: true,

        status: "published",

    })

    .sort({

        publishedAt: -1,

    });

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

  

    
