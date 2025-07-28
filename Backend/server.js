require("dotenv").config();
const app = require("./index");

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port number ${PORT}`);
});
