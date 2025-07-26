import jwtUtils from "./jwtUtils.js";

// Cookie-based authentication middleware
export function authenticateCookie(req, res, next) {
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(cookieHeader.split(';').map(c => {
    const [k, v] = c.trim().split('=');
    return [k, v];
  }));
  const token = cookies._openresponse_session;
  if (!token) return res.status(401).json({ error: "Authentication required (cookie missing)" });
  try {
    req.user = jwtUtils.decode(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid authentication cookie" });
  }
}

// Officer-only middleware
export function officerOnly(req, res, next) {
  if (req.user?.role !== "Officer") {
    return res.status(403).json({ error: "Officer access required." });
  }
  next();
}
