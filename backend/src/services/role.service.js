const User = require("../models/User");
const { SYSTEM_ROLES } = require("../constants/systemRoles");

const getRoles = async () => {
    const counts = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    for (const item of counts) {
        countMap[item._id] = item.count;
    }

    return SYSTEM_ROLES.map((role) => ({
        ...role,
        userCount: countMap[role.key] || 0,
    }));
};

module.exports = {
    getRoles,
};
