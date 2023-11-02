const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const getBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find();
  res.status(200).json({
    success: response ? 1 : 0,
    brands: response ? response : "Something went wrong",
  });
});

const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new Error("Missing input");
  const response = await Brand.create(req.body);
  res.status(200).json({
    success: response ? 1 : 0,
    category: response ? response : "Something went wrong",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Brand.findByIdAndDelete(id);
  res.status(200).json({
    success: response ? 1 : 0,
    deleted: response ? response : "Something went wrong",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  if (!title || !id) throw new Error("Missing input");
  const response = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: response ? 1 : 0,
    updatedBrand: response ? response : "Something went wrong",
  });
});

module.exports = {
  createBrand,
  updateBrand,
  getBrands,
  deleteBrand,
};
