require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/db');
const cors=require('cors')
const User = require('./Model/UserModel');
const userRoutes=require('./Route/UserRoute')
const postRoutes=require('./Route/PostRoute')
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;






connectDB();


app.use(cors({ origin: "*" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());


app.use("/user",userRoutes)
app.use("/post",postRoutes)

app.get('/hey', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on port number ${PORT}`);
});
