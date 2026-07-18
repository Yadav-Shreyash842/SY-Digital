const footer = require("./footer");

const welcomeEmail = (name) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">

            <h2>Welcome to SY Digital 🚀</h2>

            <p>Hi <strong>${name}</strong>,</p>

            <p>Thank you for joining SY Digital.</p>

            <p>We are excited to help you grow your business with our digital services.</p>

            <br>

            <p>Regards,</p>

            <h3>SY Digital Team</h3>

            ${footer()}

        </div>
    `;
};

module.exports = welcomeEmail;
