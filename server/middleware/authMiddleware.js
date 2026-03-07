import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token validat, user ID:", decoded.id);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.warn("User not found in DB");
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Token invalid:", error.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    console.warn("No token in headers");
    return res.status(401).json({ message: "No token provided" });
  }
};
