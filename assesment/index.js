const axios = require('axios');
require('dotenv').config()

const BEARER_TOKEN = ''

const MERAKI_JWT = '';

const tableName = 'assessments';

const postBaseURL = '';
const getBaseURL = '';

const merakiAssesConv = async () => {
  const coData = await axios.get(`${getBaseURL}/assessment/allAssessments`, {
    headers: {
      'version-code': 5050505,
      Authorization: `Bearer ${MERAKI_JWT}`
    },
  });

  const allAssesments = coData.data
  allAssesments.map(async ele => {
    const data = {
      data: {
        "name": ele.name,
        "content": JSON.parse(JSON.parse(ele.content)).value,
        "exercise": ele.exercise_id
      }
    }
    // const res = await postData(data);
    // console.log(res.data.data.id);
  })
}

const postData = async (data) => {
  const res = await axios
    .post(`${postBaseURL}/${tableName}`, data, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
  return res
}


// merakiAssesConv();
