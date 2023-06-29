const express = require("express");
const router = express.Router();

const usersController = require("../controllers/users_controller");
const auth = require("../config/middleware").auth;

router.post("/signUp", usersController.signUp);
router.post("/signIn", usersController.signIn);
router.post("/refreshToken", usersController.refreshToken);
router.get("/userInfo", auth, usersController.userInfo);
router.delete("/deleteUser/:userId", usersController.deleteUser);

module.exports = router;
