const userService = require("../service/userService");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  const data = await userService.loginService(email, password);
  return res.status(data.status).json(data);
};

const handleRegister = async (req, res) => {
  let { name, email, password, phone, address } = req.body;
  const data = { name, email, password, phone, address };
  let users = await userService.registerService(data);
  return res.status(users.status).json(users);
};

const getUsers = async (req, res) => {
  try {
    const data = await userService.getAllUser();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      status: 400,
      data: {},
      message: "Bad Request",
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        status: 400,
        data: {},
        message: "User ID is required",
      });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: {},
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: 200,
      data: user,
      message: "User fetched successfully",
    });

  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({
      status: 500,
      data: {},
      message: "Internal Server Error",
    });
  }
};


const changePass = async (req, res) => {
  try {
    let { email, password } = req.body;
    let users = await userService.changePassword(email, password);
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      users: {},
      message: "Bad Request",
    });
  }
};

const handleAddFavorite = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId);
    const { type, favoriteId } = req.body;

    if (!userId || !type || !favoriteId) {
      return res.status(400).json({
        status: 400,
        message: "Missing required fields",
        data: null
      });
    }
    
    if (type !== 'business' && type !== 'individual') {
      return res.status(400).json({
        status: 400,
        message: "Invalid favorite type. Must be 'business' or 'individual'",
        data: null
      });
    }

    const result = await userService.addFavorite(userId, type, favoriteId);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null
    });
  }
};

const handleDeleteFavorite = async (req, res) => {
  try {
    const { userId, type, favoriteId } = req.body;
    if (!userId || !type || !favoriteId) {
      return res.status(400).json({
        status: 400,
        message: "Missing required fields",
        data: null
      });
    }

    if (type !== 'business' && type !== 'individual') {
      return res.status(400).json({
        status: 400,
        message: "Invalid favorite type. Must be 'business' or 'individual'",
        data: null
      });
    }

    const result = await userService.deleteFavorite(userId, type, favoriteId);
    return res.status(result.status).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      data: null
    });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  getUsers,
  changePass,
  handleAddFavorite,
  handleDeleteFavorite,
  getUserById
};
