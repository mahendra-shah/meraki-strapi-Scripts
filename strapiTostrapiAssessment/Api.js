const axios = require("axios");
const postBaseURL = "http://3.110.213.190/api";
// const postBaseURL = "http://localhost:1337/api";
const tableName = "assessments";
// let BEARER_TOKEN =
//   "b0041255f0d636b62860aaa933fdc6d186d2a85652da44c81c2ea21a20140f3fcda7197713b23920a4a971a87b3bd694cff0429df90e604da040a9550f8a3f1de5d478700ca004debfc0344a5adda29854c6b717ddd579687c2212ffcf974b647b2e33352728257a1b1c63d893022cd03837c57dc82e49accb644f1d439824a4";
const BEARER_TOKEN = '97194fcf58ac129f284485aede83cac7e662c5a50af07162c84c22575c392b60ebd3b3ffeb3afe7a7a8e26cc1d6f2b6943fe0c542f04dabb4febbf0069fcf02353462266c7192f7ba04bd3a3d3e07d256feee16f106501772a0078e57a49df6196922b936189bc6e1b74ce2bbaecfe8fbbfd0bcb145ace48e224f872fcf8d1c8'
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
    
    
    console.log('👉 Returned data:', res.data.data);
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

    console.log("Update successful", resp.data);
    return resp;
  } catch (error) {
    console.log();
    console.error("Update failed", error);
  }
};

module.exports = { updateData };
