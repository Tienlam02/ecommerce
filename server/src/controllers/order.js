const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const cart = await User.findById(id) // lấy tất cả sản phẩm từ cart
    .select("cart")
    .populate("cart.product", "price");

  if (cart.cart.length === 0) {
    return res.status(400).json({
      success: 0,
      mess: "No product in Cart",
    });
  }

  const orderData = cart?.cart?.map((el) => ({
    // lọc lại dữ liệu từ cart để đổ vào order
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));
  // tính tổng tiền
  let total = cart?.cart?.reduce(
    (sum, el) => el.product.price * el.quantity + sum,
    0
  );

  console.log(req.body.coupon);
  if (req.body.coupon) {
    // tìm mã giảm giá
    const coupon = await Coupon.findOne({ title: req.body.coupon }).select(
      "discount expiry -_id"
    );
    // kiểm tra có mã và hạn sử dụng của mã
    const currentTime = new Date();
    if (coupon && currentTime < coupon.expiry) total *= +coupon.discount;
    else {
      return res.status(400).json({
        success: 0,
        mess: "Coupon is valid or expire",
      });
    }
  }

  const newOrder = await Order.create({
    products: orderData,
    total,
    orderBy: id,
    coupon: null,
  });

  return res.status(200).json({
    success: newOrder ? 1 : 0,
    cart: newOrder ? newOrder : "Something went wrong",
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing input");
  const response = await Order.findByIdAndUpdate(id, { status }, { new: true });
  return res.status(200).json({
    success: response ? 1 : 0,
    updatedStatus: response ? response : "Something went wrong",
  });
});

const userGetOrder = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const response = await Order.find({ orderBy: id }); // phải dùng find không dùng findOne vì một ng có nhiều order
  return res.status(200).json({
    success: response ? 1 : 0,
    orderUser: response ? response : "Something went wrong",
  });
});
const adminGetOrder = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.status(200).json({
    success: response ? 1 : 0,
    orders: response ? response : "Something went wrong",
  });
});

module.exports = {
  createOrder,
  updateStatus,
  userGetOrder,
  adminGetOrder,
};
