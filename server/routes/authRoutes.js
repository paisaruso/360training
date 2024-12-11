const express = require("express");
const { requiresAuth } = require("express-openid-connect");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/callback", authController.callback);
router.get("/logout", authController.logout);
router.get("/salir", authController.salir);
router.get("/profile", requiresAuth(), authController.getProfile);
router.post("/check-user", authController.checkUser);
router.get("/dashboard-redirect", authController.dashboardRedirect);

module.exports = router;
