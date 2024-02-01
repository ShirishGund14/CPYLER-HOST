const express = require("express");
const {
    getAllCodesController,
  createCodeController,
  updateCodeController,
  getCodeByIdController,
  deleteCodeController,
  userCodeController,
} = require("../controllers/codeController");

//router object
const router = express.Router();

//routes
// GET || all codes
// router.get("/all-codes", getAllCodesController);




//POST || create code
router.post("/create-code", createCodeController);

//PUT || update code
router.put("/update-code/:id", updateCodeController);

//GET || SIngle code Details
router.get("/get-code/:id", getCodeByIdController);

//DELETE || delete code
router.delete("/delete-code/:id", deleteCodeController);

router.get("/user-code/:id", userCodeController);



module.exports = router;
