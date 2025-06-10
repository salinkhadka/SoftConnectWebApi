require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/db');
const User = require('./Model/UserModel');
const userRoutes=require('./Route/UserRoute')
const app = express();
const PORT = process.env.PORT || 3000;



connectDB();
app.use(express.json());


app.use("/user",userRoutes)

app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});
