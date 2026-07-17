const { createPayment , getAllPayments , getPaymentById , updatePaymentStatus , getPaymentStats , getMonthlyPaymentAnalytics , getPaymentStatusAnalytics} = require("../services/payment.service");

const ApiResponse = require("../utils/ApiResponse");

const create = async (req, res, next) => {

    try {

        const payment = await createPayment(req.body);

        return res.status(201).json(

            new ApiResponse(

                201,

                "Payment created successfully",

                payment

            )

        );

    } catch (error) {

        next(error);

    }

};

const getAll = async (req, res, next) => {

    try {

        const payments = await getAllPayments(req.query);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Payments fetched successfully",

                payments

            )

        );

    } catch (error) {

        next(error);

    }

};

const getById = async (req, res, next) => {

    try {

        const payment = await getPaymentById(req.params.id);

        return res.status(200).json(

            new ApiResponse(

                200,

                "Payment fetched successfully",

                payment

            )

        );

    } catch (error) {

        next(error);

    }

};

const updateStatus = async (req, res, next) => {

    try {

        const payment = await updatePaymentStatus(

            req.params.id,

            req.body.paymentStatus

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Payment status updated successfully",

                payment

            )

        );

    } catch (error) {

        next(error);

    }

};

const paymentStats = async (req, res, next) => {

    try {

        const stats = await getPaymentStats();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Payment statistics fetched successfully",

                stats

            )

        );

    } catch (error) {

        next(error);

    }

};

const monthlyAnalytics = async (req, res, next) => {

    try {

        const analytics = await getMonthlyPaymentAnalytics();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Monthly payment analytics fetched successfully",

                analytics

            )

        );

    } catch (error) {

        next(error);

    }

};

const statusAnalytics = async (req, res, next) => {

    try {

        const analytics = await getPaymentStatusAnalytics();

        return res.status(200).json(

            new ApiResponse(

                200,

                "Payment status analytics fetched successfully",

                analytics

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

    paymentStats,

    monthlyAnalytics,

    statusAnalytics,

};