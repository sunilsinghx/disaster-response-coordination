export function mockAuthMiddleware(req, res, next) {
  const mockUsers = {
    netrunnerX: { id: "netrunnerX", role: "admin" },
    reliefAdmin: { id: "reliefAdmin", role: "contributor" },
    fieldAgent: { id: "fieldAgent", role: "contributor" },
  };

  let user = req.headers["x-user"];

  if (user) {
    try {
      user = JSON.parse(user);
    } catch (e) {
      console.warn("Invalid JSON in x-user header");
      user = undefined;
    }
  }

  if (user?.username && mockUsers[user.username]) {
    req.user = mockUsers[user.username];
  } else {
    req.user = { id: "guest", role: "guest" };
  }

  next();
}
