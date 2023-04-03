const axios = require('axios');
const fs = require('fs')
const path = require('path');
require('dotenv').config()

const BEARER_TOKEN = '';
// const MERAKI_JWT = '';

const postBaseURL = '';
const getBaseURL = '';

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
        const st = strapiData.data.data[0].id
        // console.log(exe);
        console.log(st, '&&&&&&&', strapiData.data.data[0].attributes.name);
        // return;
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
            console.log(res.data.data.id, '-> ✔️')
            // return res.data;
        } catch (error) {
            console.error(error.message);
        }

    }
    console.log(course_id, '<-- course --> ✔️');

}
const starter = async () => {
    for (let i = 8; i <= 104; i++) {
        await getMeraki(i);
    }
} 
// starter();
