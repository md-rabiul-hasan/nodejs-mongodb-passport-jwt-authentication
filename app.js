require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const authRouter = require("./routes/auth.routes");

const app = express();
const saltRound = 10;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);

// database connection
require('./config/database');



app.get("/", (req, res) => {
    res.send("<h1>Welcome</h1>");
})



//resource not found
app.use((req, res, next) => {
    res.status(404).json({
      message: "route not found",
    });
  });
  
  //server error
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });


app.listen(process.env.PORT, () => {
    console.log(`server is running at http://localhost:${process.env.PORT}`);
});
  