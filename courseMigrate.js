const axios = require('axios');
require('dotenv').config()

const postBaseURL = '';
const getBaseURL = '';

const getData = async () => {
  const coData = await axios.get(`${getBaseURL}/courses`, {
    headers: {
      'version-code': 345948,
    },
  });
  const unsortedData = coData.data;
  const allCourse = await unsortedData.sort(function(a, b) { // to sort the data by id
    return a.id - b.id;
    });

  // console.log(allCourse)
  // return;
  // eslint-disable-next-line no-restricted-syntax
  for (const course of allCourse) {
    // if (course.id > 0 && course.id < 6 ) {
      const data = {
        data: {
          name: course.name,
          short_description: course.short_description,
          logo: course.logo,
          lang_available: course.lang_available,
          // pathways: 1,
        },
      };
      // eslint-disable-next-line no-await-in-loop
      const res = await axios
        .post(`${postBaseURL}/tablename`, data, {
          headers: {
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          },
        })
      // console.log(res.data.data)
      console.log(course.id, 'yes..')
      // return // comment this to add all course to curriculum
    // }
    // console.log(course.id, 'no..')
  }
};
getData();
