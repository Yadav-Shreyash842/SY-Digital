const footer = () => {
    const year = new Date().getFullYear();
    return `
        <hr style="border:none; border-top:1px solid #e5e7eb; margin:30px 0;" />
        <p style="font-size:12px; color:#6b7280; text-align:center; margin:0;">
            &copy; ${year} SY Digital. All rights reserved.
        </p>
    `;
};

module.exports = footer;
