const transporter = require("../config/email");

const sendEmail = async ({ to, subject, html }) => {

    const mailOptions = {

        from: process.env.EMAIL_USER,

        to,

        subject,

        html,

    };

    return await transporter.sendMail(mailOptions);

};

module.exports = {

    sendEmail,

};