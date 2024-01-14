const axios = require('axios');
const updateSingleExericisesData = require('./updateExercises');

let exerciseDataUrl = `https://merp-strapi.merakilearn.org/api/exercises/`;


const postBaseURL = 'http://localhost:1337/api';
const BEARER_TOKEN = '5f51010f55eba43d455af2038444710f76edd05733172f4992f5721fa04fccb0643e9e3c0589aaa2f7003587094ef1b1ebb8d5782e195ccb804963e82d47637b5d7acb133576f1b23bb061b7208cd8242e5c15174e127a12e9fc7f27162be333b39db0fd2d3c81ddacf86a31e2966897700e02e67a22bc834bb0f790a2f7c3eb';

let exerciseURL
const updateExercisesData = async () => {
    for (let i = 1351; i <= 1455; i++) { // put you range here till the last exercise id which you want to update
        exerciseURL = exerciseDataUrl + `${i}?populate=course`;
        let exerciseData = await updateSingleExericisesData(exerciseURL);
        let exerciseId = exerciseData.id;
        delete exerciseData.id;
        const courseId = exerciseData.course.data.id;
        const slugData = {
            name: exerciseData.name,
            created_at: exerciseData.created_at,
            type: exerciseData.type,
            slug: exerciseData.name,
            course: courseId,
            updated_at: exerciseData.updated_at,
            published_at: exerciseData.published_at,
            created_by_id: null,
            updated_by_id: null
        };
        let slugFormatedData = {
            data: slugData
        }
        let slugId;
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
                console.log('Returned data:', response.data.data);
                return response.data.data;
            })
            .catch(err => {
                console.log(`Axios request failed: ${err}`);
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
            });


    }
}

updateExercisesData();