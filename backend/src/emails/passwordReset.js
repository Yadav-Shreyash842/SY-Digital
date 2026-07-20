const footer = require("./footer");

const passwordResetEmail = (name, resetUrl) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2>Password Reset Request</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <br>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">Reset Password</a>
            <br><br>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <br>
            <p>Regards,</p>
            <h3>SY Digital Team</h3>
            ${footer()}
        </div>
    `;
};

module.exports = passwordResetEmail;
