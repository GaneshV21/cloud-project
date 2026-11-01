const { verifyToken } = require("../utils/jwt");
const AuthMiddleWare = (req, res, next) => {
  // Node lowercases incoming header names
  let token = req.headers["x-auth-header"];
  let user_id = req.params.user_id;
  if (!token) {
    return next({ status: 401, message: "UnAuthourized User" });
  }
  let verify = verifyToken(token);
  let payload = verify?.decoded;
  if (!verify.valid || payload?.user_id !== user_id) {
    return next({
      status: 401,
      message: "Token is Expired or UnAuthourized User",
    });
  }
  next();
};

module.exports = { AuthMiddleWare };
