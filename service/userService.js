require("dotenv").config();
const User = require("../model/users");

const Users = require("../model/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);

const loginService = async (email, password) => {
  try {
    // fetch user by email
    let user = await Users.findOne({ email: email });
    if (user) {
      // compare password
      const isMatchPass = await bcrypt.compare(password, user.password);
      if (!isMatchPass) {
        return {
          status: 400,
          message: "Email not found or password is incorrect",          
        };
      } else {
        // Create a access token
        const payload = {
          email: user.email,
          password: user.password,
          userId: user._id,
        };
        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPRIE,
        });
        return {
          access_token,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
            avatar: user.avatar,
            favorite: user.favorite,
          },
          status: 200,
          message: "Login Success",
        };
      }
    } else {
      return {
        status: 400,
        user: null,
        message: "Email not found or password is incorrect",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

const hashPassword = async (password) => {
  try {
    const hashPass = await bcrypt.hashSync(password, salt);
    return hashPass;
  } catch (error) {
    console.log(error);
  }
};

const registerService = async (userData) => {
  try {
    let hashPassFrom = await hashPassword(userData.password);
    let user = await Users.findOne({ email: userData.email });
    if (user) {
      return {
        status: 400,
        message: "Email already exists",
      };
    }
    
    let result = await Users.create({
      name: userData.name,
      email: userData.email,
      password: hashPassFrom,
      phone: userData.phone,
      address: userData.address
    });

    if (!result) {
      return {
        status: 400,
        message: "Register Failed",
      };
    }

    return {
      status: 200,
      message: "Register Success",
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

const getUserById = async (userId) => {
  return await User.findById(userId)
};

const getAllUser = async () => {
  try {
    let result = await Users.find({}).select("-password");
    return result;
  } catch (error) {
    console.log(error);
  }
};

const changePassword = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    let user = await Users.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );
    if (!user) {
      return "Người dùng không tồn tại";
    }
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const addFavorite = async (userId, type, favoriteId) => {
  try {
    const updateField = `favorite.${type}`;
    
    // Check if user exists
    const user = await Users.findById(userId);
    if (!user) {
      return {
        status: 404,
        message: "User not found",
        data: null
      };
    }

    // Check if already in favorites
    if (user.favorite[type].includes(favoriteId)) {
      return {
        status: 400,
        message: "Already in favorites",
        data: user
      };
    }

    // Add to favorites
    const result = await Users.updateOne(
      { _id: userId },
      { $addToSet: { [updateField]: favoriteId } }
    );

    if (result.modifiedCount === 0) {
      return {
        status: 400,
        message: "Failed to add favorite",
        data: null
      };
    }

    // Get updated user
    const updatedUser = await Users.findById(userId);
    return {
      status: 200,
      message: "Added to favorites successfully",
      data: updatedUser.favorite
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null
    };
  }
};

const deleteFavorite = async (userId, type, favoriteId) => {
  try {
    const updateField = `favorite.${type}`;
    
    // Check if user exists
    const user = await Users.findById(userId);
    if (!user) {
      return {
        status: 404,
        message: "User not found",
        data: null
      };
    }

    // Check if exists in favorites
    if (!user.favorite[type].includes(favoriteId)) {
      return {
        status: 404,
        message: "Favorite not found",
        data: null
      };
    }

    // Remove from favorites
    const result = await Users.updateOne(
      { _id: userId },
      { $pull: { [updateField]: favoriteId } }
    );

    if (result.modifiedCount === 0) {
      return {
        status: 400,
        message: "Failed to remove favorite",
        data: null
      };
    }

    // Get updated user
    const updatedUser = await Users.findById(userId);
    return {
      status: 200,
      message: "Removed from favorites successfully",
      data: updatedUser.favorite
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal Server Error",
      data: null
    };
  }
};

module.exports = {
  loginService,
  registerService,
  getAllUser,
  changePassword,
  addFavorite,
  deleteFavorite,
  getUserById
};
