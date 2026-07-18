require("dotenv").config();

const transporter = require("./src/config/email");

async function testEmail() {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Email Test",
            text: "Congratulations! Your email configuration is working.",
        });

        console.log("Email sent successfully!");
        console.log(info.messageId);
    } catch (error) {
        console.error(error);
    }
}

testEmail();