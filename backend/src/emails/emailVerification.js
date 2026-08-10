const footer = require("./footer");

const emailVerification = (name, verifyUrl) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">

            <h2>Verify your email address</h2>

            <p>Hi <strong>${name}</strong>,</p>

            <p>Thanks for signing up for SY Digital. Please confirm your email address by clicking the button below to activate your account.</p>

            <p style="margin: 24px 0;">
                <a href="${verifyUrl}" style="background:#7C3AED; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:bold; display:inline-block;">Verify Email</a>
            </p>

            <p>If the button doesn't work, copy and paste this link into your browser:</p>

            <p><a href="${verifyUrl}" style="color:#7C3AED;">${verifyUrl}</a></p>

            <p>This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</p>

            <br>

            <p>Regards,</p>

            <h3>SY Digital Team</h3>

            ${footer()}

        </div>
    `;
};

module.exports = emailVerification;
