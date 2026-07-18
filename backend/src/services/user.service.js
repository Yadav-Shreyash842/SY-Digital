const mongoose = require("mongoose");

const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const USER_SELECT = "firstName lastName email phone avatar role isVerified createdAt updatedAt";
const MAX_LIMIT = 100;

const escapeRegex = (value = "") => {
	return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const parsePage = (value) => {
	const page = Number.parseInt(value, 10);

	return Number.isFinite(page) && page > 0 ? page : 1;
};

const parseLimit = (value) => {
	const limit = Number.parseInt(value, 10);

	if (!Number.isFinite(limit) || limit <= 0) {
		return 10;
	}

	return Math.min(limit, MAX_LIMIT);
};

const buildUserFilter = (query = {}) => {
	const filter = {};

	if (query.search) {
		const search = escapeRegex(query.search.trim());

		if (search) {
			filter.$or = [
				{
					firstName: {
						$regex: search,
						$options: "i",
					},
				},
				{
					lastName: {
						$regex: search,
						$options: "i",
					},
				},
				{
					email: {
						$regex: search,
						$options: "i",
					},
				},
				{
					phone: {
						$regex: search,
						$options: "i",
					},
				},
			];
		}
	}

	if (query.role) {
		filter.role = query.role;
	}

	if (query.isVerified !== undefined) {
		filter.isVerified = query.isVerified === true || query.isVerified === "true";
	}

	return filter;
};

const buildUserSort = (query = {}) => {
	const sortOrder = query.sortOrder === "desc" ? -1 : 1;

	switch (query.sort) {
		case "firstName":
			return { firstName: sortOrder };

		case "lastName":
			return { lastName: sortOrder };

		case "email":
			return { email: sortOrder };

		case "role":
			return { role: sortOrder };

		case "updatedAt":
			return { updatedAt: sortOrder };

		case "oldest":
			return { createdAt: 1 };

		case "newest":
		default:
			return { createdAt: -1 };
	}
};

const assertValidUserId = (userId) => {
	if (!mongoose.isValidObjectId(userId)) {
		throw new ApiError(400, "Invalid user ID");
	}
};

const getAllUsers = async (query = {}) => {
	const page = parsePage(query.page);
	const limit = parseLimit(query.limit);
	const skip = (page - 1) * limit;
	const filter = buildUserFilter(query);
	const sort = buildUserSort(query);

	const [totalItems, users] = await Promise.all([
		User.countDocuments(filter),
		User.find(filter)
			.select(USER_SELECT)
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.lean(),
	]);

	return {
		users,
		pagination: {
			page,
			limit,
			totalItems,
			totalPages: Math.max(1, Math.ceil(totalItems / limit)),
		},
	};
};

const getUserById = async (userId) => {
	assertValidUserId(userId);

	const user = await User.findById(userId)
		.select(USER_SELECT)
		.lean();

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	return user;
};

const updateUser = async (userId, updateData) => {
	assertValidUserId(userId);

	const allowedFields = ["firstName", "lastName", "phone", "avatar"];
	const sanitizedUpdateData = {};

	allowedFields.forEach((field) => {
		if (updateData[field] !== undefined) {
			sanitizedUpdateData[field] = updateData[field];
		}
	});

	if (Object.keys(sanitizedUpdateData).length === 0) {
		return getUserById(userId);
	}

	const user = await User.findByIdAndUpdate(
		userId,
		{ $set: sanitizedUpdateData },
		{
			new: true,
			runValidators: true,
		}
	)
		.select(USER_SELECT)
		.lean();

	if (!user) {
		throw new ApiError(404, "User not found");
	}

	return user;
};

const deleteUser = async (userId) => {
	assertValidUserId(userId);

	const user = await User.findByIdAndDelete(userId)
		.select(USER_SELECT)
		.lean();


	if (!user) {
		throw new ApiError(404, "User not found");
	}

	return user;
};

module.exports = {
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
};
