const router = require("express").Router();
const {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/productCategoryCtl");

const { verifyAccessToken, isAdmin } = require("../middlerwares/jwt");

router.get("/", getCategories);

router.use(verifyAccessToken, isAdmin);

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
