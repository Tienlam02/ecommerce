const router = require("express").Router();
const {
  createProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProducts,
  ratings,
  uploadImageProduct,
} = require("../controllers/product.ctl");

const uploader = require("../config/cloudinary.config");

const { verifyAccessToken, isAdmin } = require("../middlerwares/jwt");

router.post("/", [verifyAccessToken, isAdmin], createProduct);

router.get("/:id", getProduct);
router.get("/", [verifyAccessToken, isAdmin], getProducts);

router.delete("/:id", [verifyAccessToken, isAdmin], deleteProduct);

router.put("/rating", verifyAccessToken, ratings);
router.put("/:id", [verifyAccessToken, isAdmin], updateProduct);
router.put(
  "/uploadimage/:id",
  [verifyAccessToken, isAdmin],
  uploader.array("images", 5),
  uploadImageProduct
);

module.exports = router;
