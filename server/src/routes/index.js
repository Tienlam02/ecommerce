const userRouter = require("./user.route");
const productRouter = require("./product");
const categoryRouter = require("./productCategoryRoute");
const blogCategoryRouter = require("./blogCategory");
const blogRouter = require("./blog");
const brandRouter = require("./brand");
const couponRouter = require("./coupon");
const orderRouter = require("./order");
const { notFound, handlerErr } = require("../middlerwares/handlerErr");
const initRoutes = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/category", categoryRouter);
  app.use("/api/v1/blog", blogRouter);
  app.use("/api/v1/blog-category", blogCategoryRouter);
  app.use("/api/v1/brand", brandRouter);
  app.use("/api/v1/coupon", couponRouter);
  app.use("/api/v1/order", orderRouter);
  app.use(notFound); // xu ly loi khi client truy cap vao api khong dinh nghia
  app.use(handlerErr); // xu ly loi khi api ban ra loi
};

module.exports = initRoutes;
