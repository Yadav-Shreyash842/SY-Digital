const hashPassword = require("./src/utils/hashPassword");

(async () => {
    const hashed = await hashPassword("password123");
    console.log(hashed);
})();