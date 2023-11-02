const router = require("express").Router();
const {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  getUsers,
  deleteUser,
  updateCurrentUser,
  updateUserByAdmin,
  updateCart,
} = require("../controllers/user.ctl");

const { verifyAccessToken, isAdmin } = require("../middlerwares/jwt");

router.get("/", [verifyAccessToken, isAdmin], getUsers); // lấy toàn bộ user
router.get("/currentuser", verifyAccessToken, getCurrent); // lấy chính nó

router.post("/register", register); // đăng kí
router.post("/login", login); // đăng nhập
router.post("/refreshtoken", refreshAccessToken);

router.put("/", verifyAccessToken, updateCurrentUser); // sửa chính nó
router.put("/cart", verifyAccessToken, updateCart); // sửa chính nó
router.put("/:id", [verifyAccessToken, isAdmin], updateUserByAdmin); // sửa by admin

router.delete("/", [verifyAccessToken, isAdmin], deleteUser); // xóa

module.exports = router;
