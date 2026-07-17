const {

    createMessage,

    getAllMessages,

    getMessageById,

    updateMessageStatus,

    deleteMessage,

    replyToMessage,

    getMessageStats,

    getMonthlyMessageAnalytics,

    getRecentMessages,

} = require("../services/message.service");

const ApiResponse = require("../utils/ApiResponse");

const create = async (req, res, next) => {

    try {

        const message = await createMessage(req.body);

        return res.status(201).json(

            new ApiResponse(

                201,

                "Message submitted successfully",

                message

            )

        );

    } catch (error) {

        next(error);

    }

};

const getAll = async (req, res, next) => {

    try {

        const data = await getAllMessages(req.query);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Messages fetched successfully",

                data

            )

        );

    } catch (error) {

        next(error);

    }

};


const getById = async (req, res, next) => {

    try {

        const message = await getMessageById(req.params.id);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Message fetched successfully",

                message

            )

        );

    } catch (error) {

        next(error);

    }

}; 

const updateStatus = async (req, res, next) => {

    try {

        const message = await updateMessageStatus(

            req.params.id,

            req.body.status

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Message status updated successfully",

                message

            )

        );

    } catch (error) {

        next(error);

    }

}; 

const remove = async (req, res, next) => {

    try {

        await deleteMessage(req.params.id);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Message deleted successfully"

            )

        );

    } catch (error) {

        next(error);

    }

};

const reply = async (req, res, next) => {

    try {

        const message = await replyToMessage(

            req.params.id,

            req.body.adminReply,

            req.user._id

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Reply sent successfully",

                message

            )

        );

    } catch (error) {

        next(error);

    }

};

const stats = async (req, res, next) => {

    try {

        const statistics = await getMessageStats();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Message statistics fetched successfully",

                statistics

            )

        );

    } catch (error) {

        next(error);

    }

};

const monthlyAnalytics = async (req, res, next) => {

    try {

        const analytics = await getMonthlyMessageAnalytics();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Monthly analytics fetched successfully",

                analytics

            )

        );

    } catch (error) {

        next(error);

    }

};

const recentMessages = async (req, res, next) => {

    try {

        const messages = await getRecentMessages();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Recent messages fetched successfully",

                messages

            )

        );

    } catch (error) {

        next(error);

    }

};



module.exports = {

    create,

    getAll,

    getById,

    updateStatus,

    remove,

    reply,

    stats,

    monthlyAnalytics,

    recentMessages,

};