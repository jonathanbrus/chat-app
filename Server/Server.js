const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Router = require("./Routes/Routes");

const app = express();

dotenv.config();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(Router);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, () =>
      console.log(`Server running on PORT : ${PORT}`)
    );

    const io = require("./Sockets").init(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:3002",
        ],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log(socket.id);
      socket.on("disconnect", () => console.log("disconnected", socket.id));
    });
  })
  .catch((err) => console.log(err));
