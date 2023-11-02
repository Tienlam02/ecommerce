const router = require("express").Router();
const ctl = require("../controllers/brand");

const { verifyAccessToken, isAdmin } = require("../middlerwares/jwt");

router.get("/", ctl.getBrands);

router.use(verifyAccessToken, isAdmin);

router.post("/", ctl.createBrand);
router.put("/:id", ctl.updateBrand);
router.delete("/:id", ctl.deleteBrand);

module.exports = router;
