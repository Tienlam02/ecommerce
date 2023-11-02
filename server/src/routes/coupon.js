const router = require("express").Router();
const ctl = require("../controllers/coupon");

const { verifyAccessToken, isAdmin } = require("../middlerwares/jwt");

router.get("/", ctl.getCoupons);
router.use(verifyAccessToken, isAdmin);
router.post("/", ctl.createCoupon);
router.put("/:id", ctl.updateCoupon);
router.delete("/:id", ctl.deleteCoupon);

module.exports = router;
