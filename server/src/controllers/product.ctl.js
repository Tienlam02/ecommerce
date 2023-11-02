const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? 1 : 0,
    product: newProduct ? newProduct : "Something went wrong",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Product.findByIdAndDelete(id);
  console.log(response, "res");
  res.status(200).json({
    success: response ? 1 : 0,
    mess: response
      ? `Delete ${response._id} successfully`
      : "Cannot delete product",
  });
});
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  if (req.body.title) req.body.slug = slugify(req.body.title);
  const response = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({
    success: response ? 1 : 0,
    productUpdate: response ? response : "Cannot update product",
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const response = await Product.find({ _id: id });
  res.status(200).json({
    success: response ? 1 : 0,
    product: response ? response : "Cannot get product",
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  console.log("query ban dau", queries);
  //tách các trường đặc biệt
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  console.log("query sao khi tac lan 1", queries);
  //format lại các trường
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);

  if (queries?.title)
    // tìm kiếm theo title có chứa 1 từ trong title gửi từ client
    formatedQueries.title = { $regex: queries.title, $options: "i" };

  let queryCommand = Product.find(formatedQueries);

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }

  // fields
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  } else {
    queryCommand = queryCommand.select("-__v");
  }

  // pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 2;
  const skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  const [response, count] = await Promise.all([
    queryCommand,
    Product.find(formatedQueries).countDocuments(),
  ]);

  return res.status(200).json({
    success: response ? 1 : 0,
    count,
    product: response ? response : "Something went wrong",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { star, comment, pid } = req.body;

  if (!pid || !star) throw new Error("Missing input");

  const productRating = await Product.findById(pid);
  const alreadyRating = productRating?.ratings?.find(
    (el) => el.postedBy.toString() === id
  );
  let response = null;
  if (alreadyRating) {
    response = await Product.updateOne(
      {
        // tim
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: { "ratings.$.star": star, "ratings.$.comment": comment },
      },
      { new: true }
    );
  } else {
    response = await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: id } },
      },
      { new: true }
    );
  }
  const product = await Product.findById(pid);
  const totalRating = product.ratings.reduce((sum, el) => {
    return (sum += el.star);
  }, 0);

  product.totalRatings = totalRating / product.ratings.length;

  await product.save();
  res.status(200).json({
    success: response ? 1 : 0,
    product,
  });
});

const uploadImageProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.files.length === 0) throw new Error("Missing input");
  const response = await Product.findByIdAndUpdate(
    id,
    { $push: { image: { $each: req.files.map((el) => el.path) } } },
    { new: true }
  );
  res.status(200).json({
    success: response ? 1 : 0,
    updatedProcut: response ? response : "Something went wrong",
  });
});

module.exports = {
  uploadImageProduct,
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
};
