const axios = require('axios');
require('dotenv').config()

const merakiToStrapiConverter = require('./converter')

const BEARER_TOKEN = ''; // strapi

const MERAKI_JWT = ''

const tableName = 'assessments';

const postBaseURL = 'http://localhost:1337/api';

const Strapi = require('strapi-sdk-js');

const strapi = new Strapi({
  url: '#',
});

const converter = new merakiToStrapiConverter();

const merakiAssesConvNew = async () => {
  try {
    const res = await strapi.find('assessments');
    const totalAssess = res.meta.pagination.total;

    for (let id = 1; id <= totalAssess; id++) {
      const assessmentRes = await strapi.findOne('assessments', id);
      const assessData = assessmentRes.data;
      const content = assessData.attributes.content;
      let solution;

      content.forEach(ele => {
        if (ele.component === 'solution') {
          solution = ele.value;
        }
      });

      const [questionAsk, optionAsk, outputAsk] = await translateMeraki(content, solution);
      // console.log(outputAsk)

      const data = {
        data: {
          "question": JSON.stringify(({
            time: Date.now(),
            blocks: questionAsk,
            version: '2.23.2'
          })),
          "dynamic": optionAsk,
          "explaination": outputAsk[0]
        }
      };

      const resp = await axios.put(`${postBaseURL}/${tableName}/${id}`, data, {
        headers: {
          'version-code': 5050505,
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`
        },
      });

      console.log(resp.data.data.id, '--- assessment_id');
      // return;
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
};

const translateMeraki = async (data, sol) => {
  const questionAsk = [];
  const optionAsk = [];
  const outputAsk = [];

  try {
    for (let comp of data) {
      if (comp.component === 'questionExpression') {
        const question = converter.question(comp);
        questionAsk.push(question);
      } else if (comp.component === 'questionCode') {
        const questionCode = converter.questionCode(comp);
        questionAsk.push(questionCode);
      } else if (comp.component === 'image') {
        const img = converter.image(comp);
        questionAsk.push(img);
      } else if (comp.component === 'options') {
        const para = converter.options(comp, sol);
        optionAsk.push(para);
      } else if (comp.component === 'output') {
        const output = converter.output(comp);
        outputAsk.push(output);
      }
    }

    return [questionAsk, optionAsk[0], outputAsk];
  } catch (err) {
    console.error('Error occurred:', err.message);
  }
};

merakiAssesConvNew();