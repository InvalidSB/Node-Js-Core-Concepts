const express = require("express");
const router = express();

const {
  userAuth,
  loginUserFunc,
  checkRole,
  registerUserFunc,
  serializeUser
} = require("../controllers/Auth");

// Users ko lagi Registeration Route
router.post("/register-user", async (req, res) => {
  await registerUserFunc(req.body, "user", res);
});

// Admin ko lagi Registration Route
router.post("/register-admin", async (req, res) => {
  await registerUserFunc(req.body, "admin", res);
});

// Super Admin ko lagi Registration Route
router.post("/register-super-admin", async (req, res) => {
  await registerUserFunc(req.body, "superadmin", res);
});

// Users ko lagi Login Route
router.post("/login-user", async (req, res) => {
  await loginUserFunc(req.body, "user", res);
});

// Admin ko lagi Login Route
router.post("/login-admin", async (req, res) => {
  await loginUserFunc(req.body, "admin", res);
});

// Super Admin ko lagi Login Route
router.post("/login-super-admin", async (req, res) => {
  await loginUserFunc(req.body, "superadmin", res);
});

// Profile ko lagi Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// Users ko lagi Protected Route
router.get(
  "/user-protectd",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

// Admin ko lagi Protected Route
router.get(
  "/admin-protectd",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json("Hello Admin");
  }
);

// Super Admin ko lagi  Protected Route
router.get(
  "/super-admin-protectd",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello Super Admin");
  }
);

// Super Admin ko lagi Protected Route
router.get(
  "/super-admin-and-admin-protectd",
  userAuth,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json("Super admin and Admin");
  }
);

module.exports = router;