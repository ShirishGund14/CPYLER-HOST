const fs=require('fs');
const path=require('path');
const {v4:uuid}=require('uuid');

const dirCodes=path.join(__dirname,"codes");


if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive:true});
}

const generateFile=async(format,content)=>{
   const jobId=uuid(); 
   const filename=`${jobId}.${format}` //11551.cpp

   const filepath=path.join(dirCodes,filename);

   console.log('generated filename',filename);
   console.log('generated filepath',filepath);
   await  fs.writeFileSync(filepath,content);
   return filepath;
};

module.exports={generateFile,};