const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { config } = require("dotenv");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cookieparser = require("cookie-parser");

const routes = require("./src/routes/v1/index.route");

const corsOpts = {
  origin: "*",
  methods: ["GET, POST, PUT, DELETE", "PATCH"],
  allowedHeaders: ["Content-Type"],
};
config();

const port = 5000;
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors(corsOpts));
app.use(cookieparser());

app.use("/api/v1", routes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connection created", socket.id);
  socket.join("figma_like");

  socket.on("onMouseMove", (payload) => {
    socket.emit("onMouseMove", payload);
    io.to("figma_like").emit("onMouseMove", payload);
  });

  socket.on("disconnect", (reason) => {
    console.log("Connection disconnected", socket.id);
  });
});

mongoose.connect("mongodb://0.0.0.0:27017/figmaLike", {
  useNewUrlParser: true,
});
mongoose.connection
  .once("open", function () {
    console.log("Database connected Successfully");
  })
  .on("error", function (err) {
    console.log("Error", err);
  });

httpServer.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});
