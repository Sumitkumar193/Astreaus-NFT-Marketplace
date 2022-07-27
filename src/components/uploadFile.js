const pinataApiKey = "3d2488400d4fa75a5e2c";
const pinataSecretApiKey = "55d6713ca0f0d6d6dddfc60b63faadec7e09a4dddc3a5a3cd5e40cf38c3c09a7";
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const pinFileToIPFS = async () => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;=
  let data = new FormData();
  data.append("file", fs.createReadStream("./pathtoyourfile.png"));
  const res = await axios.post(url, data, {
    maxContentLength: "Infinity", 
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`
      //"pinata_Api_key": pinataApiKey, 
      //"pinata_secret_api_key": pinataSecretApiKey,
    },
  });
  console.log(res.data);
};
pinFileToIPFS();