const express = require("express");
const usersAPI = require("../controller/userController");
const serviceController = require("../controller/serviceController");
const categoryController = require("../controller/categoryController");
const Individual = require("../controller/Individual");
const Business = require("../controller/Business");
const RatingController = require("../controller/Rating");
const { verifyToken } = require("../middleware/auth");
const routerAPI = express.Router();

// API login
routerAPI.post("/login", usersAPI.handleLogin);
routerAPI.post("/register", usersAPI.handleRegister);

// API Users
routerAPI.get("/user", verifyToken, usersAPI.getUserById);
routerAPI.put("/update", verifyToken, usersAPI.changePass);
routerAPI.post("/add-favorite", verifyToken, usersAPI.handleAddFavorite);
routerAPI.post("/delete-favorite", verifyToken, usersAPI.handleDeleteFavorite);

// API Service
routerAPI.post("/services", serviceController.createService);
routerAPI.get("/services", serviceController.getAllService);
routerAPI.put("/services/:id", serviceController.updateService);

// API Category
routerAPI.post("/categories", categoryController.createCategory);
routerAPI.get("/categories", categoryController.getPopularCategories);
routerAPI.put("/categories/:id", categoryController.updateCategory);
routerAPI.get("/categories/:id", categoryController.getByIdCategory);

routerAPI.get("/search", Business.handleSearch);

// API Business
routerAPI.post("/business", Business.createBusiness);
routerAPI.get("/business", Business.getAllBusiness);
routerAPI.put("/business/:id", Business.updateBusiness);
routerAPI.get("/business/:id", Business.getByIdBusiness);
routerAPI.post("/business/rating", Business.addRating);

// API Services sorted by city and rating
routerAPI.get("/services/by-city", Business.getServicesByCity);

// API individual
routerAPI.post("/individuals", Individual.createIndividuals);
routerAPI.get("/individuals", Individual.getAllIndividuals);
routerAPI.put("/individuals/:id", Individual.updateIndividuals);
routerAPI.get("/individuals/:id", Individual.getByIdIndividuals);
routerAPI.post("/individuals/rating", Individual.addRating);


module.exports = routerAPI;
