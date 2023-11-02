const notFound = (req, res, next) => {
  console.log(1);
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next(error);
};
// khi co error nhận vào là đối số nó  chạy vào middler đó khi sảy ra lỗi khi đang xử lý req
const handlerErr = (error, req, res, next) => {
  console.log(2);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json({
    success: 0,
    mess: error?.message,
  });
};

module.exports = {
  notFound,
  handlerErr,
};
