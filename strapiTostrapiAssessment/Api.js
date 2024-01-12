const axios = require("axios");
const postBaseURL = "http://3.110.213.190/api";
// const postBaseURL = "http://localhost:1337/api";
const tableName = "assessments";
// let BEARER_TOKEN =
//   "b0041255f0d636b62860aaa933fdc6d186d2a85652da44c81c2ea21a20140f3fcda7197713b23920a4a971a87b3bd694cff0429df90e604da040a9550f8a3f1de5d478700ca004debfc0344a5adda29854c6b717ddd579687c2212ffcf974b647b2e33352728257a1b1c63d893022cd03837c57dc82e49accb644f1d439824a4";
const BEARER_TOKEN = '280117da5dfa181ef74b08bd6f454e0f1ce1e050306a3717947130b67482a8a81220f8864bcecece303b6b336a2979ce3ec1ba1996adaa7baf59c0065860b37ba80d90241aef3ec9f51dfd0083b0f0d61554cec70d4b1c1cb8d9bc3e12a1431e3fdb1f21317f1fb8c961096141e7a28a6c23f65c9ea26b922104a1ca7843ab8d';
const updateData = async (
  modifyQuestion,
  modifyOption,
  modifyExplaination,
  ID,
  slugData
) => {
  const data = {
    data: {
      question: modifyQuestion,
      explaination: modifyExplaination,
      option: modifyOption,
    },
  };

  // data.data['slug']='this is slug...'
  const slugFormate = {
    data:slugData
  }

  try {
    const res = await axios.post(`${postBaseURL}/slugs`, slugFormate, {
      headers: {
        // 'Content-Type': 'application/json',
        // 'version-code': '5050505',
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    });
    
    
    console.log('👉 Slug id:', res.data.data.id);
    const { data: { id } } = res.data;
    let slugId = id;
    data.data['slug']=slugId
    
    const resp = await axios.put(`${postBaseURL}/${tableName}/${ID}`, data, {
      headers: {
        // 'version-code': 5050505,
        Authorization: `Bearer ${BEARER_TOKEN}`,
        // 'Content-Type': 'application/json',
      },
    });

    console.log("Update successful", resp.data.data.id);
    return resp;
  } catch (error) {
    console.log();
    console.error("Update failed", error);
  }
};

module.exports = { updateData };
