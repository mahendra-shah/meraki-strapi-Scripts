const axios = require('axios');
const fs = require('fs')
const path = require('path');
require('dotenv').config()
const merakiToStrapiConverter = require('./merakiToStrapi');

const BEARER_TOKEN = ''
const MERAKI_JWT = '';

const tableName = 'exercises';

const postBaseURL = '';
const getBaseURL = '';

const converter = new merakiToStrapiConverter();

const filePath = path.join(__dirname, 'tableWalaExerciseId.json');
const exercisesWithTable = [];
let cId = 0;

const translateMeraki = async (data) => {
  let isTable = false;
  const convertedContent = [];
  try {
    for (let comp of data) {
      // console.log(comp, 'oooooooooooo')

      if (comp.component == 'header') {
        const head = converter.header(comp)
        convertedContent.push(head)

      } else if (comp.component == 'text' && !comp.decoration) {
        const para = converter.paragraph(comp)
        convertedContent.push(para)

      } else if (comp.component == 'text' && comp.decoration) {
        isTable = true;
        const list = converter.list(comp)
        convertedContent.push(list)

      } else if (comp.component == 'code') {
        const code = converter.code(comp)
        convertedContent.push(code)

      } else if (comp.component == 'youtube') {
        const ytEmb = converter.ytEmbed(comp)
        convertedContent.push(ytEmb)

      } else if (comp.component == 'image') {
        const img = converter.image(comp)
        convertedContent.push(img)

      } else if (comp.component == 'table') {
        const table = converter.table(comp)
        convertedContent.push(table)

      }
    }
    return [convertedContent, isTable];
  } catch (err) {
    console.error(err, err.message);
  }
}

const postData = async (data) => {
  // console.log(data)
  const res = await axios
    .post(`${postBaseURL}/${tableName}`, data, {
      headers: {
        'version-code': 5050505,
        // Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    })
  return res
}

const getMeraki = async (course_id) => {
  const coData = await axios.get(`${getBaseURL}/courses/${course_id}/exercises`, {
    headers: {
      'version-code': 345948,
      Authorization: `Bearer ${MERAKI_JWT}`
    },
  });
  const fullCourse = coData.data
  cId = coData.data.course.id
  console.log(fullCourse.course.name)
  // return
  
  for (let exercise of fullCourse.course.exercises) {
    if (exercise.name) {
      const [convertedContent, decision] = await translateMeraki(exercise.content)
      const strapiFormat = {
        "time": Date.now(),
        "blocks": convertedContent,
        "version": "2.23.2"
      }
      const data = {
        data: {
          name: exercise.name,
          description: exercise.description,
          content: JSON.stringify(strapiFormat),
          type: exercise.type,
          sequence_num: exercise.sequence_num,
          course: fullCourse.course.id
        }
      }
      const res = await postData(data)
      console.log(res.data.data.id)
      if (decision) exercisesWithTable.push(res.data.data.id)
    }
    // console.log(convertedContent, '\n 77777777777777')


    // return
  }
  
  // storing ids of exercise which have list inside
  let tableExeIds = [];
  if (fs.existsSync(filePath)) {
    const tab = fs.readFileSync(filePath)
    if (tab) tableExeIds = JSON.parse(fs.readFileSync(filePath));
  }
  tableExeIds = [...tableExeIds, ...exercisesWithTable]
  const data = fs.writeFileSync(filePath, JSON.stringify(tableExeIds,  null, 2));
  console.log(course_id, '-->', exercisesWithTable );

}

const course_id = 505; // give course id
getMeraki(course_id)