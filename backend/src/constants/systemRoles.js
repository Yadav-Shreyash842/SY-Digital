const ROLES = require("../constants/roles");

const SYSTEM_ROLES = [
    {
        key: ROLES.ADMIN,
        name: "Admin",
        description: "Full system access with complete control over all modules, users, and configurations.",
        permissions: [
            "Manage System Settings",
            "Create & Manage All Users",
            "Assign & Modify Roles",
            "Access All Data",
            "Manage All Content",
            "View All Analytics & Reports",
            "Security & Audit Logs",
            "Approve or Reject Requests",
        ],
    },
    {
        key: ROLES.MANAGER,
        name: "Manager",
        description: "Manages day-to-day operations, client projects, and team workflows within assigned areas.",
        permissions: [
            "Manage Assigned Clients",
            "Create & Edit Content",
            "View Team Reports",
            "Monitor Project Progress",
            "Access Assigned Data",
        ],
    },
    {
        key: ROLES.CLIENT,
        name: "Client",
        description: "Limited access to view own data, projects, and submit service requests.",
        permissions: [
            "View Own Projects & Data",
            "View Own Analytics",
            "Submit Support Requests",
        ],
    },
];

module.exports = { SYSTEM_ROLES };
