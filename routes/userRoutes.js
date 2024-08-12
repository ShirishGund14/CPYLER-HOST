const express = require("express");
const {
  getAllUsers,
  registerController,
  loginController,
  userDashboardController,
  userInfoController,
  testController
} = require("../controllers/userContoller");


const authMiddleware= require('../middlewares/authMiddleware')





//router object
const router = express.Router();

router.get("/test",authMiddleware, testController);

// GET ALL USERS || GET
router.get("/all-users", getAllUsers);

// CREATE USER || POST
router.post("/register", registerController);


router.post("/login", loginController);

//get info dashboard
router.get('/:id/dashboard',userDashboardController);


//get Current user
router.get('/:id',userInfoController);



module.exports = router;
