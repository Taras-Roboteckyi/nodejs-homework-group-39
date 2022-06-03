/* const mongoose = require("mongoose"); */
const app = require("./app");

const { PORT = 4600 } = process.env;

app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
