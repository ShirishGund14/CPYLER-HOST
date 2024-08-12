const mongoose = require("mongoose");
const codeModel=require('../models/codeModel')
const userModel = require("../models/userModel");
const {generateFile}=require('../generateFile');
const {executeCpp}=require("../executeCpp")
const {executePy}=require("../executePy")
const {executeC} =require('../excuteC')


exports.RunCodeController=async(req,res)=>{
  const {language="cpp",code,userInput}=req.body;

  if(code===undefined){
      return res.status(400).json({
          success:false,
          error:"Empty code body!"
      })
  }
  try {

  //need to generate  a code file with contetnt from req
  const filepath=await generateFile(language,code);


  //we need to run the file and send the res
  let output;
  if(language==='cpp'){
       output=await executeCpp(filepath,userInput);
  }
  else if(language==='c'){
    
    output=await executeC(filepath,userInput);
  }
  else {
       output=await executePy(filepath,userInput);
  }
  
  return res.json({filepath,output});
  } catch (err) {
      res.status(500).json({err});
  }
}

//Create code
// http://localhost:8080/api/v1/code/all-codes
exports.createCodeController = async (req, res) => {
  try {
    const { title, language,description,  user } = req.body;
    
    if (!title || !description || !language || !user) {
      return res.send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    const exisitingUser = await userModel.findById(user);
    
    if (!exisitingUser) {
      return res.send({
        success: false,
        message: "unable to find user",
      });
    }

    const newCode=  new codeModel({ 
      title, 
      language,
      description,
      user });

    await newCode.save();

    return res.status(201).send({
      success: true,
      message: "Code Saved Successfully!",
      newCode,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Error WHile Creting code",
      error,
    });
  }
};

//Update Code
exports.updateCodeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title,language, description} = req.body;
    const code = await codeModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Code Updated!",
      code,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Error WHile Updating Blog",
      error,
    });
  }
};

//SIngle code
exports.getCodeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const code = await codeModel.findById(id);
    if (!code) {
      return res.send({
        success: false,
        message: "code not found with this is",
      });
    }
    return res.status(200).send({
      success: true,
      message: "fetch single code",
      code,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "error while getting single code",
      error,
    });
  }
};

//Delete code
//   http://localhost:8080/api/v1/code/delete-code/:id
exports.deleteCodeController = async (req, res) => {
  try {
    const code = await codeModel.findByIdAndDelete(req.params.id).populate("user");
    // console.log('codeid',code)
    await code.user.codes.pull(code);
    await code.user.save();
    return res.status(200).send({
      success: true,
      message: "code Deleted!",
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Erorr WHile Deleteing Code",
      error,
    });
  }
};

//GET All USER code
exports.userCodeController = async (req, res) => {
  try {
    //const userCode = await userModel.findById(req.params.id).populate("codes");
   // console.log('usercodes',userCode)
   const exisitingUser=await userModel.findById(req.params.id)
   const allcodes=await codeModel.find({user:req.params.id});

    if (!exisitingUser) {
      return res.send({
        success: false,
        message: "codes not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "All user-saved codes Fetched Successfully",
      allcodes,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "error in user code",
      error,
    });
  }
};


