const footer = require("./footer");

const passwordResetSuccessEmail = (name) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2>Password Updated Successfully</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your password has been updated successfully.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
            <br>
            <p>Regards,</p>
            <h3>SY Digital Team</h3>
            ${footer()}
        </div>
    `;
};

module.exports = passwordResetSuccessEmail;
