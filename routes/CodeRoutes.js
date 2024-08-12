const express = require("express");
const {
    getAllCodesController,
  createCodeController,
  updateCodeController,
  getCodeByIdController,
  deleteCodeController,
  userCodeController,
  RunCodeController
} = require("../controllers/codeController");

const authMiddleware = require('../middlewares/authMiddleware')




const router = express.Router();


router.post("/run", RunCodeController);

// create code
router.post("/create-code",authMiddleware, createCodeController);

// update code
router.put("/update-code/:id",authMiddleware, updateCodeController);

//single code Details
router.get("/get-code/:id",authMiddleware, getCodeByIdController);

//= delete code
router.delete("/delete-code/:id",authMiddleware, deleteCodeController);

// get all user codes
router.get("/user-code/:id",authMiddleware, userCodeController);



module.exports = router;
