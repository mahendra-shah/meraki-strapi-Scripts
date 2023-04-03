const axios = require('axios');
const strapiToMerakiConverter = require('./strapiToMeraki');

const postBaseURL = '';

const translateStrapi = async () => {
  const coData = await axios.get(`${postBaseURL}/exercises/318`);
  const content = coData.data.data.attributes.content
  const blockData = JSON.parse(content).blocks
  const res = await strapiToMerakiConverter(blockData)
  console.log(res)

}

translateStrapi();