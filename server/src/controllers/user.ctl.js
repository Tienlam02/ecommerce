const User = require("../models/user");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const {
  generateAccsessToken,
  generateRefreshAccsessToken,
} = require("../middlerwares/jwt");
const register = asyncHandler(async (req, res) => {
  const { email, password, firtname, lastname } = req.body;
  if (!email || !password || !firtname || !lastname)
    return res.status(400).json({ success: 0, mess: "Missing input" });
  const user = await User.findOne({ email });
  console.log("user", user);
  if (user) throw new Error("User is existed");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? 1 : 0,
      mess: newUser ? "Register successfully" : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: 0, mess: "Missing input" });
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not exist");
  else {
    if (user.isCorrectPassword(password)) {
      const { password, role, ...userData } = user.toObject();
      const accessToken = generateAccsessToken(user._id, role);
      const refreshToken = generateRefreshAccsessToken(user._id);
      await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({
        success: 1,
        mess: "Login successfully",
        accessToken,
        userData,
      });
    } else {
      res.status(400).json({
        success: 0,
        mess: "Invalid password",
      });
    }
  }
});
const getCurrent = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select(["-password", "-role"]);
  return res.status(400).json({
    success: user ? 1 : 0,
    user: user ? user : "",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie && !cookie.refreshToken)
    throw new Error("RefreshToken not exist");
  const user = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  console.log(1);
  const response = await User.findOne({
    _id: user.id,
    refeshToken: cookie.refeshToken,
  });
  res.status(200).json({
    success: response ? 1 : 0,
    newAccessToken: response
      ? generateAccsessToken(response._id, response.role)
      : "RefreshToken not match",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // Xóa refresh token ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // Xóa refresh token ở cookie trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout is done",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  console.log(0);
  const response = await User.find();
  res.status(200).json({
    success: response ? 1 : 0,
    users: response ? response : "",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.query;
  console.log(id, "id");
  if (!id) throw new Error("Missing input");
  const response = await User.findByIdAndDelete({ _id: id });
  res.status(200).json({
    success: response ? 1 : 0,
    users: response ? `${response._id} is deleted` : "No user is delete",
  });
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { id } = req.user;
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const user = await User.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  }).select("-password -role");
  res.status(200).json({
    success: user ? 1 : 0,
    mess: user ? "Update user successfully" : "Something went wrong",
    user: user ? user : "",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  }).select("-role, -password");
  res.status(200).json({
    success: response ? 1 : 0,
    mess: response ? "Update user successfully" : "Something went wrong",
    user: response ? response : "",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { pid, quantity, color } = req.body;
  console.log(req.body);
  if (!pid || !quantity || !color) throw new Error("Missing input");

  const user = await User.findById(id);
  const alreadyProduct = user.cart.find((el) => el.product.toString() === pid);
  if (alreadyProduct) {
    const duplicateItems = user.cart.filter(
      (item, index) => item.product.toString() === pid && item.color === color
    ); // Trả về true nếu tìm thấy phần tử trùng lặp.

    if (duplicateItems.length > 0) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      res.status(200).json({
        success: response ? 1 : 0,
        mess: response ? "Add product successfully" : "Something went wrong",
        user: response ? response : "",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
      res.status(200).json({
        success: response ? 1 : 0,
        mess: response ? "Add product successfully" : "Something went wrong",
        user: response ? response : "",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    console.log(response);
    res.status(200).json({
      success: response ? 1 : 0,
      mess: response ? "Add product successfully" : "Something went wrong",
      user: response ? response : "",
    });
  }
});

module.exports = {
  register,
  login,
  refreshAccessToken,
  getCurrent,
  logout,
  getUsers,
  deleteUser,
  updateCurrentUser,
  updateUserByAdmin,
  updateCart,
};
