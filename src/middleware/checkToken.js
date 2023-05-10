const allowedPaths = [
  { method: "POST", path: "/api/v1/user" },
  { method: "POST", path: "/api/v1/user/login" },
];

function determineAllowedPath(request) {
  const method = request.method;
  const path = request.url;

  return allowedPaths.some(
    (allowedPath) => allowedPath.method === method && allowedPath.path === path
  );
}

function checkToken(req, res, next) {
  const accessToken = req.headers["access_token"];

  if (determineAllowedPath(req)) return next();

  if (accessToken) next();
  else return res.status(401).json({ error: "you need to be logged in" });
}

module.exports = {
  checkToken,
};
