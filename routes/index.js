const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log("server..");
  res.send({ response: "Api Mongo data consumer Running" }).status(200);
});

module.exports = router;