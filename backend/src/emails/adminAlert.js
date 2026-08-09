const footer = require("./footer");

const adminAlert = ({ leadName, leadEmail, type, details }) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:20px; line-height:1.6;">

            <h2 style="color:#d97706;">
                New ${type} — SY Digital
            </h2>

            <p>Hi Admin,</p>

            <p>A new <strong>${type}</strong> has just arrived on your site. Here are the details:</p>

            <table style="border-collapse: collapse; margin-top:20px; border:1px solid #e5e7eb;">

                <tr>
                    <td style="padding:10px; border:1px solid #e5e7eb;"><strong>Name</strong></td>
                    <td style="padding:10px; border:1px solid #e5e7eb;">${leadName}</td>
                </tr>

                <tr>
                    <td style="padding:10px; border:1px solid #e5e7eb;"><strong>Email</strong></td>
                    <td style="padding:10px; border:1px solid #e5e7eb;">${leadEmail}</td>
                </tr>

                <tr>
                    <td style="padding:10px; border:1px solid #e5e7eb;"><strong>Details</strong></td>
                    <td style="padding:10px; border:1px solid #e5e7eb; white-space:pre-line;">${details}</td>
                </tr>

            </table>

            <br>

            <p>Reply to the sender directly from your dashboard.</p>

            <br>

            <strong>SY Digital Team</strong>

            ${footer()}

        </div>
    `;
};

module.exports = adminAlert;