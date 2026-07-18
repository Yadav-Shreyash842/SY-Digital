const footer = require("./footer");

const meetingConfirmation = ({ name, meetingDate, meetingTime, service }) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height:1.6;">

            <h2 style="color:#2563eb;">
                Meeting Confirmed ✅
            </h2>

            <p>Hi <strong>${name}</strong>,</p>

            <p>Your meeting has been booked successfully.</p>

            <table style="border-collapse: collapse; margin-top:20px;">

                <tr>
                    <td><strong>Service</strong></td>
                    <td style="padding-left:15px;">${service}</td>
                </tr>

                <tr>
                    <td><strong>Date</strong></td>
                    <td style="padding-left:15px;">${meetingDate}</td>
                </tr>

                <tr>
                    <td><strong>Time</strong></td>
                    <td style="padding-left:15px;">${meetingTime}</td>
                </tr>

            </table>

            <br>

            <p>We'll contact you shortly before the meeting.</p>

            <br>

            <strong>SY Digital Team</strong>

            ${footer()}

        </div>
    `;
};

module.exports = meetingConfirmation;
