import express from "express";
import mongoose from "mongoose";
import Apiroute from "./routes/index";
import bodyparese from 'body-parser';
// import cors from "cors";
const app = express();


// app.use(bodyparese.json())

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
app.use(bodyparese.json())
// app.use(cors());
const PATH = {
  API: "/api",
};
app.use(PATH.API, Apiroute);

mongoose
  .connect(
    "mongodb+srv://suraj:suraj@cluster0.gmc40jo.mongodb.net/E-commerce",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("mongoose contected succesfully");
  })
  .catch((err) => {
    console.error("error in connection", err);
  });

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
  console.log(`Server Runing on port ${PORT}`);
});
