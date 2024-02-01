const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath,userInput) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  // console.log(outPath);

  return new Promise((resolve, reject) => {
    const command = `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${jobId}.exe`;

    const childProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      } else {
        resolve(stdout);
      }
    });

    // Pass user input to the stdin of the child process
    if (userInput) {
      childProcess.stdin.write(userInput);
      childProcess.stdin.end();
    }
  });



};


module.exports = {
  executeCpp,
};