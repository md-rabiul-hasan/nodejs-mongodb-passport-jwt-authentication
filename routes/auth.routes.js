const express = require("express");
const passport = require('passport');
const authController = require("./../controllers/auth.controller");
// passport middleware
const passportMiddleware = require("./../config/passport");

const router = express.Router();



router.post('/register', authController.singup);
router.post('/login', authController.login);

router.get('/profile', passport.authenticate("jwt", { session: false }), authController.profile);



module.exports = router;