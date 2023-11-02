const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const getBlogCategories = asyncHandler(async (req, res) => {
  const response = await BlogCategory.find();
  res.status(200).json({
    success: response ? 1 : 0,
    blogCategories: response ? response : "Something went wrong",
  });
});

const createBlogCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new Error("Missing input");
  const response = await BlogCategory.create(req.body);
  res.status(200).json({
    success: response ? 1 : 0,
    blogCategory: response ? response : "Something went wrong",
  });
});

const deleteBLogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await BlogCategory.findByIdAndDelete(id);
  res.status(200).json({
    success: response ? 1 : 0,
    deleted: response ? response : "Something went wrong",
  });
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  if (!title || !id) throw new Error("Missing input");
  const response = await BlogCategory.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: response ? 1 : 0,
    updatedBlogCategory: response ? response : "Something went wrong",
  });
});

module.exports = {
  createBlogCategory,
  updateBlogCategory,
  getBlogCategories,
  deleteBLogCategory,
};
