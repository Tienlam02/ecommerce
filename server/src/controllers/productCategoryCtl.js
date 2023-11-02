const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const getCategories = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find();
  res.status(200).json({
    success: response ? 1 : 0,
    categories: response ? response : "Something went wrong",
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new Error("Missing input");
  const response = await ProductCategory.create(req.body);
  res.status(200).json({
    success: response ? 1 : 0,
    category: response ? response : "Something went wrong",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await ProductCategory.findByIdAndDelete(id);
  res.status(200).json({
    success: response ? 1 : 0,
    deleted: response ? response : "Something went wrong",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  if (!title || !id) throw new Error("Missing input");
  const response = await ProductCategory.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: response ? 1 : 0,
    updatedCategory: response ? response : "Something went wrong",
  });
});

module.exports = {
  createCategory,
  updateCategory,
  getCategories,
  deleteCategory,
};
