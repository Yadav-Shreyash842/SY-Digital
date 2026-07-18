const footer = require("./footer");

const paymentReceipt = ({ name, amount, paymentId }) => {
    const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(amount);

    return `
        <div style="font-family: Arial, sans-serif; padding:20px;">

            <h2>Payment Received 💳</h2>

            <p>Hello <strong>${name}</strong>,</p>

            <p>We have successfully received your payment.</p>

            <table style="border-collapse:collapse;">

                <tr>
                    <td><strong>Payment ID</strong></td>
                    <td style="padding-left:15px;">${paymentId}</td>
                </tr>

                <tr>
                    <td><strong>Amount</strong></td>
                    <td style="padding-left:15px;">${formattedAmount}</td>
                </tr>

            </table>

            <br>

            <p>Thank you for choosing SY Digital.</p>

            ${footer()}

        </div>
    `;
};

module.exports = paymentReceipt;
