const footer = require("./footer");

const reviewApproved = (name) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">

            <h2>Thank You ⭐</h2>

            <p>Hi <strong>${name}</strong>,</p>

            <p>Your review has been approved and published.</p>

            <p>We truly appreciate your feedback.</p>

            <br>

            <strong>SY Digital Team</strong>

            ${footer()}

        </div>
    `;
};

module.exports = reviewApproved;
