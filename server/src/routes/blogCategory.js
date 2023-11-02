const router = require("express").Router();
const {
  createBlogCategory,
  updateBlogCategory,
  getBlogCategories,
  deleteBLogCategory,
} = require("../controllers/blogCategory");

const { verifyAccessToken, isAdmin } = require("../middlerwares/jwt");

router.get("/", getBlogCategories);

router.use(verifyAccessToken, isAdmin);

router.post("/", createBlogCategory);
router.put("/:id", updateBlogCategory);
router.delete("/:id", deleteBLogCategory);

module.exports = router;
