const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing input");
  const response = await Blog.create(req.body);
  res.status(200).json({
    success: response ? 1 : 0,
    blog: response ? response : "Something went wrong",
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const response = await Blog.findByIdAndDelete(id);
  res.status(200).json({
    success: response ? 1 : 0,
    deleted: response ? response : "Something went wrong",
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  res.status(200).json({
    success: response ? 1 : 0,
    blogs: response ? response : "Something went wrong",
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const response = await Blog.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({
    success: response ? 1 : 0,
    blogupdated: response ? response : "Something went wrong",
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { bid } = req.params;
  // tìm blog cần like
  // nếu đang dislike => sau khi nhắn like bỏ dislike
  // nếu đang like => sau khi nhấn like bỏ like
  // nếu như chưa gì => sau khi ấn like sẽ like
  const blog = await Blog.findById(bid);

  const alreadyDislike = blog?.disLikes?.find((el) => el.toString() === id);
  if (alreadyDislike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { disLikes: id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? 1 : 0,
      data: response ? response : "Something went wrong",
    });
  }

  const liked = blog?.likes?.find((el) => el.toString() === id);
  if (liked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: id } },
      { new: true }
    );
    res.status(200).json({
      success: response ? 1 : 0,
      data: response ? response : "Something went wrong",
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: id } },
      { new: true }
    );
    console.log(response);
    res.status(200).json({
      success: response ? 1 : 0,
      data: response ? response : "Something went wrong",
    });
  }
});

const disLike = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { bid } = req.params;

  // tìm blog cần dislike
  // nếu đang dislike => sau khi nhấn dislike sẽ bỏ dislike
  // nếu đang like => sau khi nhấn dislike bỏ like
  // nếu không gì => sau khi nhấn dislike => dislike blog

  const blog = await Blog.findById(bid);

  const alreadyLike = blog?.likes?.find((el) => el.toString() === id);
  if (alreadyLike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? 1 : 0,
      data: response ? response : "Something went wrong",
    });
  }

  const dislike = blog.disLikes?.find((el) => el.toString() === id);

  if (dislike) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { disLikes: id } },
      { new: true }
    );
    res.status(200).json({
      success: response ? 1 : 0,
      data: response ? response : "Something went wrong",
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { disLikes: id } },
      { new: true }
    );
    res.status(200).json({
      success: response ? 1 : 0,
      data: response ? response : "Something went wrong",
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  // khi api lấy ra 1 blog => sẽ lấy ra theo id và chúng ta cần cập lại numberView + 1 theo mỗi lần gọi api để tính số lươt xem blog
  const { bid } = req.params;
  const response = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberView: 1 } },
    { new: true }
  )
    .populate("likes", "_id firtname lastname")
    .populate("disLikes", "_id firtname lastname");
  res.status(200).json({
    success: response ? 1 : 0,
    blog: response ? response : "Something went wrong",
  });
});

const uploadImageBlog = asyncHandler(async (req, res) => {
  if (!req.file) throw new Error("Missing input");
  const { id } = req.params;
  const response = await Blog.findByIdAndUpdate(
    id,
    { $set: { image: req.file.path } },
    { new: true }
  );
  res.status(200).json({
    success: response ? 1 : 0,
    updateImage: response ? response : "Something went wrong",
  });
});

module.exports = {
  uploadImageBlog,
  createBlog,
  deleteBlog,
  getBlogs,
  updateBlog,
  likeBlog,
  disLike,
  getBlog,
};
