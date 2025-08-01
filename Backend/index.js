require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/db');
const cors = require('cors');
const path = require('path');

const userRoutes = require('./Route/UserRoute');
const postRoutes = require('./Route/PostRoute');
const likeRoutes = require('./Route/LikeRoute');         // ✅ New
const commentRoutes = require('./Route/CommentRoute');   // ✅ New
const notificationRoute = require('./Route/NotificationRoute');
const friendsRoute = require('./Route/FriendsRoute');
const messageRoute = require('./Route/MessageRoute');

const app = express();
const PORT = process.env.PORT || 3000;


connectDB();


app.use(cors({ origin: "*" }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

app.use("/user", userRoutes);
app.use("/post", postRoutes);
app.use("/like", likeRoutes);          
app.use("/comment", commentRoutes); 
app.use("/notifications", notificationRoute); 
app.use("/friends",friendsRoute);
app.use("/message",messageRoute);


app.get('/hey', (req, res) => {
  res.send('Hello World!');
});


// app.listen(PORT, () => {
//   console.log(`Server running on port number ${PORT}`);
// });

module.exports = app;