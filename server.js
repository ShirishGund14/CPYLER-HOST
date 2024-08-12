const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path=require('path');


dotenv.config();


const userRoutes = require("./routes/userRoutes");
const codeRoutes=require('./routes/CodeRoutes');


connectDB();


const app = express();

//middelwares
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/code", codeRoutes);


// DEPLOY
app.use(express.static(path.join(__dirname,"./client/build")));
app.get('*',function(req,res){
  res.sendFile(path.join(__dirname,"./client/build/index.html"));
});


const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode port no ${PORT}`.bgCyan
      .white
  );
});
