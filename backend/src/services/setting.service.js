const Setting = require("../models/Setting");
const ApiError = require("../utils/ApiError");

const getSettings = async () => {
    const settings = await Setting.findOne();

    if (!settings) {
        return await Setting.create({});
    }

    return settings;
};

const updateSettings = async (updateData, adminId = null) => {
    const allowedFields = [
        "agencyName",
        "supportEmail",
        "websiteUrl",
        "pushNotifications",
        "emailNotifications",
        "marketingEmails",
        "sessionTimeout",
        "twoFactor",
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            updates[field] = updateData[field];
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid settings to update");
    }

    let settings = await Setting.findOne();

    if (!settings) {
        settings = await Setting.create({ ...updates, updatedBy: adminId });
        return settings;
    }

    Object.assign(settings, updates, { updatedBy: adminId });
    await settings.save();

    return settings;
};

module.exports = {
    getSettings,
    updateSettings,
};
