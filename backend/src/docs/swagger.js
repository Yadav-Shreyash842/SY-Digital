const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SY Digital API",
            version: "1.0.0",
            description: "SY Digital Backend API Documentation",
        },
        servers: [
            {
                url: process.env.NODE_ENV === "production"
                    ? process.env.CLIENT_URL
                    : `http://localhost:${process.env.PORT || 3000}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Services", description: "Service management" },
            { name: "Projects", description: "Project management" },
            { name: "Blogs", description: "Blog management" },
            { name: "Meetings", description: "Meeting management" },
            { name: "Payments", description: "Payment management" },
            { name: "Reviews", description: "Review management" },
            { name: "Messages", description: "Contact message management" },
            { name: "Notifications", description: "Notification management" },
            { name: "Dashboard", description: "Admin dashboard analytics" },
            { name: "Upload", description: "File upload endpoints" },
            { name: "Health", description: "Health check" },
        ],
        paths: {
            "/health": {
                get: {
                    tags: ["Health"],
                    summary: "Health check",
                    security: [],
                    responses: {
                        200: {
                            description: "Server is healthy",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean", example: true },
                                            status: { type: "string", example: "OK" },
                                            uptime: { type: "number" },
                                            timestamp: { type: "string", format: "date-time" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/auth/register": {
                post: {
                    tags: ["Auth"],
                    summary: "Register a new user",
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["firstName", "lastName", "email", "password"],
                                    properties: {
                                        firstName: { type: "string" },
                                        lastName: { type: "string" },
                                        email: { type: "string", format: "email" },
                                        password: { type: "string", minLength: 8 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: { description: "User registered successfully" },
                        400: { description: "Validation error" },
                        409: { description: "Email already exists" },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    tags: ["Auth"],
                    summary: "Login",
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["email", "password"],
                                    properties: {
                                        email: { type: "string", format: "email" },
                                        password: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: { description: "Login successful" },
                        401: { description: "Invalid credentials" },
                    },
                },
            },
            "/api/auth/profile": {
                get: {
                    tags: ["Auth"],
                    summary: "Get current user profile",
                    responses: {
                        200: { description: "Profile fetched successfully" },
                        401: { description: "Unauthorized" },
                    },
                },
            },
            "/api/services": {
                get: {
                    tags: ["Services"],
                    summary: "Get all services",
                    security: [],
                    parameters: [
                        { name: "page", in: "query", schema: { type: "integer" } },
                        { name: "limit", in: "query", schema: { type: "integer" } },
                        { name: "search", in: "query", schema: { type: "string" } },
                        { name: "category", in: "query", schema: { type: "string" } },
                        { name: "status", in: "query", schema: { type: "string" } },
                        { name: "featured", in: "query", schema: { type: "boolean" } },
                    ],
                    responses: { 200: { description: "Services fetched successfully" } },
                },
                post: {
                    tags: ["Services"],
                    summary: "Create a service (Admin)",
                    responses: {
                        201: { description: "Service created" },
                        401: { description: "Unauthorized" },
                        403: { description: "Forbidden" },
                    },
                },
            },
            "/api/services/featured": {
                get: {
                    tags: ["Services"],
                    summary: "Get featured services",
                    security: [],
                    responses: { 200: { description: "Featured services fetched" } },
                },
            },
            "/api/services/{slug}": {
                get: {
                    tags: ["Services"],
                    summary: "Get service by slug",
                    security: [],
                    parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Service fetched" }, 404: { description: "Not found" } },
                },
            },
            "/api/services/{id}": {
                patch: {
                    tags: ["Services"],
                    summary: "Update service (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Service updated" }, 404: { description: "Not found" } },
                },
                delete: {
                    tags: ["Services"],
                    summary: "Delete service (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Service deleted" }, 404: { description: "Not found" } },
                },
            },
            "/api/projects": {
                get: {
                    tags: ["Projects"],
                    summary: "Get all projects",
                    security: [],
                    parameters: [
                        { name: "page", in: "query", schema: { type: "integer" } },
                        { name: "limit", in: "query", schema: { type: "integer" } },
                        { name: "search", in: "query", schema: { type: "string" } },
                        { name: "category", in: "query", schema: { type: "string" } },
                        { name: "status", in: "query", schema: { type: "string" } },
                    ],
                    responses: { 200: { description: "Projects fetched" } },
                },
                post: {
                    tags: ["Projects"],
                    summary: "Create a project (Admin)",
                    responses: { 201: { description: "Project created" } },
                },
            },
            "/api/projects/featured": {
                get: {
                    tags: ["Projects"],
                    summary: "Get featured projects",
                    security: [],
                    responses: { 200: { description: "Featured projects fetched" } },
                },
            },
            "/api/projects/{slug}": {
                get: {
                    tags: ["Projects"],
                    summary: "Get project by slug",
                    security: [],
                    parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Project fetched" }, 404: { description: "Not found" } },
                },
            },
            "/api/projects/{id}": {
                patch: {
                    tags: ["Projects"],
                    summary: "Update project (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Project updated" } },
                },
                delete: {
                    tags: ["Projects"],
                    summary: "Delete project (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Project deleted" } },
                },
            },
            "/api/blogs": {
                get: {
                    tags: ["Blogs"],
                    summary: "Get all blogs",
                    security: [],
                    parameters: [
                        { name: "page", in: "query", schema: { type: "integer" } },
                        { name: "limit", in: "query", schema: { type: "integer" } },
                        { name: "search", in: "query", schema: { type: "string" } },
                        { name: "category", in: "query", schema: { type: "string" } },
                        { name: "status", in: "query", schema: { type: "string" } },
                    ],
                    responses: { 200: { description: "Blogs fetched" } },
                },
                post: {
                    tags: ["Blogs"],
                    summary: "Create a blog (Admin)",
                    responses: { 201: { description: "Blog created" } },
                },
            },
            "/api/blogs/featured": {
                get: {
                    tags: ["Blogs"],
                    summary: "Get featured blogs",
                    security: [],
                    responses: { 200: { description: "Featured blogs fetched" } },
                },
            },
            "/api/blogs/{slug}": {
                get: {
                    tags: ["Blogs"],
                    summary: "Get blog by slug",
                    security: [],
                    parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Blog fetched" }, 404: { description: "Not found" } },
                },
            },
            "/api/blogs/{id}": {
                patch: {
                    tags: ["Blogs"],
                    summary: "Update blog (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Blog updated" } },
                },
                delete: {
                    tags: ["Blogs"],
                    summary: "Delete blog (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Blog deleted" } },
                },
            },
            "/api/meetings": {
                post: {
                    tags: ["Meetings"],
                    summary: "Book a meeting",
                    security: [],
                    responses: { 201: { description: "Meeting booked" }, 409: { description: "Slot already booked" } },
                },
                get: {
                    tags: ["Meetings"],
                    summary: "Get all meetings (Admin)",
                    responses: { 200: { description: "Meetings fetched" } },
                },
            },
            "/api/meetings/{id}": {
                get: {
                    tags: ["Meetings"],
                    summary: "Get meeting by ID (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Meeting fetched" }, 404: { description: "Not found" } },
                },
                patch: {
                    tags: ["Meetings"],
                    summary: "Update meeting (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Meeting updated" } },
                },
                delete: {
                    tags: ["Meetings"],
                    summary: "Delete meeting (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Meeting deleted" } },
                },
            },
            "/api/meetings/{id}/status": {
                patch: {
                    tags: ["Meetings"],
                    summary: "Update meeting status (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Status updated" } },
                },
            },
            "/api/meetings/{id}/reschedule": {
                patch: {
                    tags: ["Meetings"],
                    summary: "Reschedule meeting (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Meeting rescheduled" } },
                },
            },
            "/api/meetings/{id}/cancel": {
                patch: {
                    tags: ["Meetings"],
                    summary: "Cancel meeting (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Meeting cancelled" } },
                },
            },
            "/api/meetings/{id}/history": {
                get: {
                    tags: ["Meetings"],
                    summary: "Get meeting history (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "History fetched" } },
                },
            },
            "/api/payments": {
                post: {
                    tags: ["Payments"],
                    summary: "Create payment (Admin)",
                    responses: { 201: { description: "Payment created" } },
                },
                get: {
                    tags: ["Payments"],
                    summary: "Get all payments (Admin)",
                    responses: { 200: { description: "Payments fetched" } },
                },
            },
            "/api/payments/dashboard/stats": {
                get: {
                    tags: ["Payments"],
                    summary: "Payment stats (Admin)",
                    responses: { 200: { description: "Stats fetched" } },
                },
            },
            "/api/payments/{id}": {
                get: {
                    tags: ["Payments"],
                    summary: "Get payment by ID (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Payment fetched" }, 404: { description: "Not found" } },
                },
            },
            "/api/payments/{id}/status": {
                patch: {
                    tags: ["Payments"],
                    summary: "Update payment status (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Status updated" } },
                },
            },
            "/api/reviews": {
                post: {
                    tags: ["Reviews"],
                    summary: "Submit a review (Admin)",
                    responses: { 201: { description: "Review submitted" } },
                },
                get: {
                    tags: ["Reviews"],
                    summary: "Get all reviews (Admin)",
                    responses: { 200: { description: "Reviews fetched" } },
                },
            },
            "/api/reviews/featured": {
                get: {
                    tags: ["Reviews"],
                    summary: "Get featured reviews",
                    security: [],
                    responses: { 200: { description: "Featured reviews fetched" } },
                },
            },
            "/api/reviews/{id}": {
                get: {
                    tags: ["Reviews"],
                    summary: "Get review by ID (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Review fetched" } },
                },
                patch: {
                    tags: ["Reviews"],
                    summary: "Update review (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Review updated" } },
                },
                delete: {
                    tags: ["Reviews"],
                    summary: "Delete review (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Review deleted" } },
                },
            },
            "/api/messages": {
                post: {
                    tags: ["Messages"],
                    summary: "Send a contact message",
                    security: [],
                    responses: { 201: { description: "Message sent" } },
                },
                get: {
                    tags: ["Messages"],
                    summary: "Get all messages (Admin)",
                    responses: { 200: { description: "Messages fetched" } },
                },
            },
            "/api/messages/{id}": {
                get: {
                    tags: ["Messages"],
                    summary: "Get message by ID (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Message fetched" } },
                },
                delete: {
                    tags: ["Messages"],
                    summary: "Delete message (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Message deleted" } },
                },
            },
            "/api/messages/{id}/status": {
                patch: {
                    tags: ["Messages"],
                    summary: "Update message status (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Status updated" } },
                },
            },
            "/api/messages/{id}/reply": {
                patch: {
                    tags: ["Messages"],
                    summary: "Reply to message (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Reply sent" } },
                },
            },
            "/api/notifications": {
                get: {
                    tags: ["Notifications"],
                    summary: "Get all notifications (Admin)",
                    responses: { 200: { description: "Notifications fetched" } },
                },
            },
            "/api/notifications/read-all": {
                patch: {
                    tags: ["Notifications"],
                    summary: "Mark all notifications as read (Admin)",
                    responses: { 200: { description: "All marked as read" } },
                },
            },
            "/api/notifications/{id}": {
                get: {
                    tags: ["Notifications"],
                    summary: "Get notification by ID (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Notification fetched" } },
                },
                delete: {
                    tags: ["Notifications"],
                    summary: "Delete notification (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Notification deleted" } },
                },
            },
            "/api/notifications/{id}/read": {
                patch: {
                    tags: ["Notifications"],
                    summary: "Mark notification as read (Admin)",
                    parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
                    responses: { 200: { description: "Marked as read" } },
                },
            },
            "/api/admin/dashboard/stats": {
                get: {
                    tags: ["Dashboard"],
                    summary: "Dashboard stats (Admin)",
                    responses: { 200: { description: "Stats fetched" } },
                },
            },
            "/api/admin/dashboard/recent-meetings": {
                get: {
                    tags: ["Dashboard"],
                    summary: "Recent meetings (Admin)",
                    responses: { 200: { description: "Recent meetings fetched" } },
                },
            },
            "/api/admin/dashboard/monthly-analytics": {
                get: {
                    tags: ["Dashboard"],
                    summary: "Monthly analytics (Admin)",
                    responses: { 200: { description: "Analytics fetched" } },
                },
            },
            "/api/admin/dashboard/meeting-status": {
                get: {
                    tags: ["Dashboard"],
                    summary: "Meeting status analytics (Admin)",
                    responses: { 200: { description: "Analytics fetched" } },
                },
            },
            "/api/admin/dashboard/upcoming-meetings": {
                get: {
                    tags: ["Dashboard"],
                    summary: "Upcoming meetings (Admin)",
                    responses: { 200: { description: "Upcoming meetings fetched" } },
                },
            },
            "/api/admin/dashboard/recent-activities": {
                get: {
                    tags: ["Dashboard"],
                    summary: "Recent activities (Admin)",
                    responses: { 200: { description: "Activities fetched" } },
                },
            },
            "/api/upload/image": {
                post: {
                    tags: ["Upload"],
                    summary: "Upload image (Admin)",
                    requestBody: {
                        content: {
                            "multipart/form-data": {
                                schema: {
                                    type: "object",
                                    properties: { image: { type: "string", format: "binary" } },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: "Image uploaded" } },
                },
            },
            "/api/upload/video": {
                post: {
                    tags: ["Upload"],
                    summary: "Upload video (Admin)",
                    requestBody: {
                        content: {
                            "multipart/form-data": {
                                schema: {
                                    type: "object",
                                    properties: { video: { type: "string", format: "binary" } },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: "Video uploaded" } },
                },
            },
        },
    },
    apis: [],
};

module.exports = swaggerJsdoc(options);
