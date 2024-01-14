const axios = require('axios');
const updateSingleExericisesData = require('./updateExercises');

let exerciseDataUrl = `https://merp-strapi.merakilearn.org/api/exercises/`;


const postBaseURL = 'http://3.110.213.190/api';
const BEARER_TOKEN = '16230fd7d526dadb3cc7404a2685d53cc1401c22b537a8df195fa4c91708f205e1a20ac6f73cf67e3b5f110e19d6e26f1381144a66ddf82df88fd2cbfa206858766a7e15f8bf40e3b7639c942e3588b122b24cbaa0a812ac0977687bc5cdfc28c36e88e03419181d3b90c9983f1c26e55e864f89acc03e6129f0c7e34bef2f14';

let exerciseURL
const updateExercisesData = async () => {
    for (let i = 1; i <= 1455; i++) { // put you range here till the last exercise id which you want to update
        exerciseURL = exerciseDataUrl + `${i}?populate=course`;
        let exerciseData = await updateSingleExericisesData(exerciseURL);
        let exerciseId = exerciseData.id;
        delete exerciseData.id;
        const courseId = exerciseData.course.data.id;
        const code = exerciseData.name.split(/\s+/).map(word => {
            const match = word.match(/[a-zA-Z]/);
            return match ? match[0] : '';
        }).join('').toLowerCase();

        const slugData = {
            name: `exercise-${exerciseId}-${code}`,
            type: exerciseData.type,
            slug: `exercise-${exerciseId}-${code}`,
            created_by_id: exerciseData.created_by_id,
            course: courseId,
            updated_by_id: null,
            published_at: exerciseData.published_at,
            created_at: Date.now(),
            updated_at: null
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
                console.log('Returned data:', response.data.data.id);
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