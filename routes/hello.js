const express = require("express");
const { greetVisitor } = require("../controllers/helloController.js");
const router = express.Router();


router.get('/hello', greetVisitor)


module.exports = router 