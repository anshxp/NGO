import { authMiddleware, adminMiddleware } from './auth.js';

const adminPath = /^\/admin(?:\/|$)/;
const protectedPath = /^\/(users(?:\/|$)|donations\/user(?:\/|$)|memberships(?:\/|$)|events\/[^/]+\/register$|internships\/[^/]+\/apply$|messages(?:\/|$)|receipts(?:\/|$))/;

export const apiSecurity = (req, res, next) => {
  if (adminPath.test(req.path)) return authMiddleware(req, res, (err) => err ? next(err) : adminMiddleware(req, res, next));
  if (protectedPath.test(req.path)) return authMiddleware(req, res, next);
  return next();
};
