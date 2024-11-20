import { validateToken } from "../services/auth.js";

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}

function preventAuthenticatedAccess(req, res, next) {
  if (req.user) {
    return res.redirect("/");
  }
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
}
export {checkForAuthenticationCookie, preventAuthenticatedAccess}
