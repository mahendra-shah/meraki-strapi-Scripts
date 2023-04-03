const axios = require('axios');
const fs = require('fs')
const path = require('path');
require('dotenv').config()

const BEARER_TOKEN = '';
// const MERAKI_JWT = '';

const postBaseURL = '';
const getBaseURL = '';

const filePath = path.join(__dirname, 'mapped.json');
// const mapped = [];
let cId = 0;

const mapped = {
    // "meraki": "strapi",
};
const getMeraki = async (course_id) => {
    const merakiData = await axios.get(`${getBaseURL}/courses/${course_id}/exercises`, {
        headers: {
            'version-code': 345948,
            // Authorization: `Bearer ${MERAKI_JWT}`
        },
    });

    
    const merakiExercises = merakiData.data.course.exercises
    for (let exe of merakiExercises) {
        const strapiData = await axios.get(`${postBaseURL}/exercises?filters[name][$eq]=${exe.name}`);
        const st = strapiData.data.id
        console.log(st, '&&&&&&&');
        const data = {
            "data": {
                "course": course_id,
            }
        }
    
        try {
            const res = await axios
                .put(`${postBaseURL}/exercises/${st}`, data, {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                    },
                });
            console.log(res.data)
            return res.data;
        } catch (error) {
            console.error(error.message);
        }

    }
    const strapiExercises = strapiData.data.data.attributes.exercises.data
    cId = merakiData.data.course.id
    // console.log(strapiExercises, '****')
    // return;
    const d = {}
    merakiExercises.forEach(obj1 => {
        if (obj1.type === 'exercise') {
            const matchingObj = strapiExercises.find(obj2 => obj2.attributes.type === 'exercise' && obj2.attributes.name === obj1.name);
            if (matchingObj) {
                d[obj1.id] = matchingObj.id;
            }
        }
    });
    mapped[cId] = d;
    console.log(cId, '--> ✔️');

}

const starter = async () => {
    for (let i = 1; i < 3; i++) {
        await getMeraki(i);
    }
    fs.writeFile('mapping.json', JSON.stringify(mapped), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`mapped ids saved to ${filePath}`);
    })
};

starter();
