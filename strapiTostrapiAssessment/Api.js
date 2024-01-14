const axios = require("axios");
// const postBaseURL = "http://3.110.213.190/api";
const postBaseURL = "http://localhost:1337/api";
const tableName = "assessments";
// let BEARER_TOKEN =
//   "b0041255f0d636b62860aaa933fdc6d186d2a85652da44c81c2ea21a20140f3fcda7197713b23920a4a971a87b3bd694cff0429df90e604da040a9550f8a3f1de5d478700ca004debfc0344a5adda29854c6b717ddd579687c2212ffcf974b647b2e33352728257a1b1c63d893022cd03837c57dc82e49accb644f1d439824a4";
const BEARER_TOKEN = '5f51010f55eba43d455af2038444710f76edd05733172f4992f5721fa04fccb0643e9e3c0589aaa2f7003587094ef1b1ebb8d5782e195ccb804963e82d47637b5d7acb133576f1b23bb061b7208cd8242e5c15174e127a12e9fc7f27162be333b39db0fd2d3c81ddacf86a31e2966897700e02e67a22bc834bb0f790a2f7c3eb';
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
