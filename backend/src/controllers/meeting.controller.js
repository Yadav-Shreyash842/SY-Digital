const { createMeeting, getAllMeetings, getMeetingById , updateMeeting , deleteMeeting , updateMeetingStatus , rescheduleMeeting , cancelMeeting , getMeetingHistory} = require("../services/meeting.service");
const ApiResponse = require("../utils/ApiResponse");

const create = async (req, res, next) => {

    try {

        const meeting = await createMeeting(
            req.body
        );

        return res.status(201).json(

            new ApiResponse(

                201,

                "Meeting booked successfully",

                meeting

            )

        );

    } catch (error) {

        next(error);

    }

};

const getAll = async (req, res, next) => {

    try {

        const meetings = await getAllMeetings(
            req.query
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Meetings fetched successfully",

                meetings

            )

        );

    } catch (error) {

        next(error);

    }

};

const getOne = async (req, res, next) => {

    try {

        const meeting = await getMeetingById(
            req.params.id
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Meeting fetched successfully",

                meeting

            )

        );

    } catch (error) {

        next(error);

    }

};

const update = async (req, res, next) => {

    try {

        const meeting = await updateMeeting(
            req.params.id,
            req.body
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Meeting updated successfully",

                meeting

            )

        );

    } catch (error) {

        next(error);

    }

};

const remove = async (req, res, next) => {

    try {

        const meeting = await deleteMeeting(
            req.params.id
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Meeting deleted successfully",

                meeting

            )

        );

    } catch (error) {

        next(error);

    }

};

const updateStatus = async (req, res, next) => {

    try {

        const meeting = await updateMeetingStatus(

            req.params.id,

            req.body.status,

            req.body.adminNotes,

            req.body.meetingLink

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Meeting status updated successfully",

                meeting

            )

        );

    } catch (error) {

        next(error);

    }

};

const reschedule = async (req, res, next) => {

    try {

        const meeting = await rescheduleMeeting(

            req.params.id,

            req.body.meetingDate,

            req.body.meetingTime

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Meeting rescheduled successfully",

                meeting

            )

        );

    } catch (error) {

        next(error);

    }

};

const cancel = async (req, res, next) => {

    try {

        const meeting = await cancelMeeting(

            req.params.id,

            req.body.reason

        );

        return res.status(200).json(

            new ApiResponse(

                200,

                "Meeting cancelled successfully",

                meeting

            )

        );

    } catch (error) {

        next(error);

    }

};

const history = async (req, res, next) => {

    try {

        const meetingHistory = await getMeetingHistory(
            req.params.id
        );

        return res.status(200).json(

            new ApiResponse(
                200,
                "Meeting history fetched successfully",
                meetingHistory
            )

        );

    } catch (error) {

        next(error);

    }

};

module.exports = {
    create,
    getAll,
    getOne,
    update,
    remove,
    updateStatus,
    reschedule,
    cancel,
    history,
};
   
    