const axios = require("axios");

const Strapi = require("strapi-sdk-js");
const { updateData } = require("./Api");
const { option,question, explaination } = require("./converter");

const strapi = new Strapi({
  url: "https://merp-strapi.merakilearn.org/api",
  // url: "http://localhost:1337/api",
  // url: 'https://merd-strapi.merakilearn.org/api/assessments'
});

const MerakiAccessData = async () => {
  try {
    const resp = await strapi.find("assessments");
    
    const totalAssessment = 591;
    for (let id = 1; id <= totalAssessment; id++) {
      // 863,
      const data = await strapi.findOne("assessments", id, {
        populate: ["dynamic", "explaination","exercise","course"],
      });
      let exerciseId = data.data.attributes.exercise.data.id
      let courseId = data.data.attributes.course.data.id
      let modifyQuestion;
      let modifyOption;
      let modifyExplaination;      
      if (data.data.attributes.question) {
        modifyQuestion = await question(data.data.attributes.question);
      }
      if (data.data.attributes.dynamic) {
        let assessmentOptions = data.data.attributes.dynamic;
        modifyOption = await option(assessmentOptions,data.data.attributes.createdAt);
      }
      if (data?.data?.attributes?.explaination) {
        let exp = JSON.parse(data.data.attributes.explaination.correct).blocks;
        modifyExplaination = await explaination(exp)

      }
      const slugData = {
        name: `c${courseId}-e${exerciseId}-ai${id}`,
        slug:`c${courseId}-e${exerciseId}-ai${id}`,
        type:'assessment',
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),

    };
      let ID = data.data.id;
    
      await updateData(modifyQuestion, modifyOption, modifyExplaination, ID, slugData);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

MerakiAccessData();
