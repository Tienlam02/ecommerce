const router = require("express").Router();
const ctl = require("../controllers/order");

const { verifyAccessToken, isAdmin } = require("../middlerwares/jwt");

router.post("/", verifyAccessToken, ctl.createOrder);
router.get("/user", verifyAccessToken, ctl.userGetOrder);
router.get("/admin", [verifyAccessToken, isAdmin], ctl.adminGetOrder);
router.put("/status/:id", [verifyAccessToken, isAdmin], ctl.updateStatus);

module.exports = router;
