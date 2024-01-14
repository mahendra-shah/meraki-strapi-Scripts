const axios = require('axios');
const updateSingleExericisesData = require('./updateExercises');

let exerciseDataUrl = `https://merp-strapi.merakilearn.org/api/exercises/`;


const postBaseURL = 'http://localhost:1337/api';
const BEARER_TOKEN = '5f51010f55eba43d455af2038444710f76edd05733172f4992f5721fa04fccb0643e9e3c0589aaa2f7003587094ef1b1ebb8d5782e195ccb804963e82d47637b5d7acb133576f1b23bb061b7208cd8242e5c15174e127a12e9fc7f27162be333b39db0fd2d3c81ddacf86a31e2966897700e02e67a22bc834bb0f790a2f7c3eb';

let exerciseURL
const updateExercisesData = async () => {
    for (let i = 1351; i <= 1455; i++) { // put you range here till the last exercise id which you want to update
        exerciseURL = exerciseDataUrl + `${i}?populate=course`;
    for (let i = 1456; i <= 1456; i++) { // put you range here till the last exercise id which you want to update
        exerciseURL = exerciseDataUrl + `${i}`;
        let exerciseData = await updateSingleExericisesData(exerciseURL);
        let exerciseId = exerciseData.id;
        delete exerciseData.id;
        // generate a unique slug for each exercise with exercise name
        const code = exerciseData.name.split(/\s+/).map(word => {
            const match = word.match(/[a-zA-Z]/);
            return match ? match[0] : '';
        }).join('').toLowerCase();
        const courseId = exerciseData.course.data.id;
        const slugData = {
            name: `exercise-${exerciseId}-${code}`,
            type:  exerciseData.type,
            slug:  `exercise-${exerciseId}-${code}`,
            created_by_id: null,
            course: courseId,
            updated_by_id: null,
            published_at: exerciseData.published_at,
            created_at: Date.now(),
            updated_at: null
        };
        let slugFormatedData = {
            data: slugData
        }
        console.log(`ID - ${exerciseId} -> ${slugData.name} -> OK`);
        // console.log(slugData, 'slugData-->');

        let slugId;
        // return;
        try {
            const res = await axios.post(`${postBaseURL}/slugs`, slugFormatedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'version-code': '5050505',
                    Authorization: `Bearer ${BEARER_TOKEN}`
                }
            });

            console.log('👉 Returned data:', `ID - ${res.data.data.id} -> ${res.data.data.attributes.name} -> OKAY`);
            const { data: { id } } = res.data;
            slugId = id;
        } catch (error) {

            console.log(`😱gggggggg Axios request failed: ${error}`);
        }

        exerciseData.slug = slugId;
        let exerciseFormatedData = {
            data: exerciseData
        }
        // update exercise data by its id
        const res = await axios.put(`${postBaseURL}/exercises/${exerciseId}`, exerciseFormatedData, {
            headers: {
                'Content-Type': 'application/json',
                'version-code': '5050505',
                Authorization: `Bearer ${BEARER_TOKEN}`
            }
        })
            .then(response => {
                console.log('Returned data of Slug:', `ID - ${response.data.data.id} -> ${response.data.data.attributes.name} -> OKAY`);
                return response.data.data;
            })
            .catch(err => {
                console.log(`Axios request failed: ${err}`);
                // console.error('Response data:', err.response.data);
                // console.error('Response status:', err.response.status);
            });


        // ########### POST API CODE ###############
        // const res = await axios
        //     .post(`${postBaseURL}/exercises`, exerciseFormatedData, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'version-code': '5050505',
        //             Authorization: `Bearer ${BEARER_TOKEN}`
        //         }
        //     })
        //     .then(response => {
        //         console.log('👉 Returned data:', response);
        //         // return response;
        //     })
        //     .catch(err => {
        //         console.log(`😱 Axios request failed: ${err}`);
        //         console.error('Response data:', err.response.data);
        //         console.error('Response status:', err.response.status);
        //     });
    }
}

updateExercisesData();