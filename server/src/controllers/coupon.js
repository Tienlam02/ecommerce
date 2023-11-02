const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find();
  res.status(200).json({
    success: response ? 1 : 0,
    brands: response ? response : "Something went wrong",
  });
});

const createCoupon = asyncHandler(async (req, res) => {
  const { title, discount, expiry } = req.body;
  if (!title || !discount || !expiry) throw new Error("Missing input");
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({
    success: response ? 1 : 0,
    coupon: response ? response : "Something went wrong",
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Coupon.findByIdAndDelete(id);
  res.status(200).json({
    success: response ? 1 : 0,
    deleted: response ? response : "Something went wrong",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, discount, expiry } = req.body;
  if (!title || !discount || !expiry) throw new Error("Missing input");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +expiry * 24 * 60 * 60 * 1000; // mili giây
  const response = await Coupon.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: response ? 1 : 0,
    updatedBrand: response ? response : "Something went wrong",
  });
});

module.exports = {
  createCoupon,
  updateCoupon,
  getCoupons,
  deleteCoupon,
};
