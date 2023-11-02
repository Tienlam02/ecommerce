const router = require("express").Router();
const ctl = require("../controllers/blogCtl");

const { verifyAccessToken, isAdmin } = require("../middlerwares/jwt");
const uploader = require("../config/cloudinary.config");
router.get("/", ctl.getBlogs);
router.get("/:bid", ctl.getBlog);

router.put("/like/:bid", verifyAccessToken, ctl.likeBlog);
router.put("/dislike/:bid", verifyAccessToken, ctl.disLike);

router.use(verifyAccessToken, isAdmin);

router.post("/", ctl.createBlog);
router.put("/:id", ctl.updateBlog);
router.put("/uploadimage/:id", uploader.single("image"), ctl.uploadImageBlog);
router.delete("/:id", ctl.deleteBlog);

module.exports = router;
