const footer = require("./footer");

const contactReply = ({ name, reply }) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">

            <h2>Response from SY Digital</h2>

            <p>Hi <strong>${name}</strong>,</p>

            <p>${reply}</p>

            <br>

            <p>If you have more questions, simply reply to this email.</p>

            <br>

            <strong>SY Digital Team</strong>

            ${footer()}

        </div>
    `;
};

module.exports = contactReply;
