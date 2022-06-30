const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const { dbURI } = require('./config/keys');

const app = express();
app.use(express.json());

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");

// Routes
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/user", userRoutes);

// Static serve
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))
  )
  .catch((err) => console.log(err));
