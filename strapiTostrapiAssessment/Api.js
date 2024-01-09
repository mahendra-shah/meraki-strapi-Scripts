const axios = require("axios");
const postBaseURL = "http://localhost:1337/api";
const tableName = "assessments";
let BEARER_TOKEN =
  "b0041255f0d636b62860aaa933fdc6d186d2a85652da44c81c2ea21a20140f3fcda7197713b23920a4a971a87b3bd694cff0429df90e604da040a9550f8a3f1de5d478700ca004debfc0344a5adda29854c6b717ddd579687c2212ffcf974b647b2e33352728257a1b1c63d893022cd03837c57dc82e49accb644f1d439824a4";

const updateData = async (
  modifyQuestion,
  modifyOption,
  modifyExplaination,
  ID
) => {
  const data = {
    data: {
      question: modifyQuestion,
      explaination: modifyExplaination,
      option: modifyOption,
    },
  };
  try {
    const resp = await axios.put(`${postBaseURL}/${tableName}/${ID}`, data, {
      headers: {
        // 'version-code': 5050505,
        Authorization: `Bearer ${BEARER_TOKEN}`,
        // 'Content-Type': 'application/json',
      },
    });

    console.log("Update successful", resp.data);
    return resp;
  } catch (error) {
    console.log();
    console.error("Update failed", error);
  }
};

module.exports = { updateData };
