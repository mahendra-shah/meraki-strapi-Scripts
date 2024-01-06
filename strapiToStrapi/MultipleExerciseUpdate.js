const axios = require('axios');
const updateSingleExericisesData = require('./updateExercises');

let exerciseDataUrl = `https://merd-strapi.merakilearn.org/api/exercises/`;


const postBaseURL = 'http://localhost:1337/api';
const BEARER_TOKEN = '';

let exerciseURL
const updateExercisesData = async () => {
    for (let i = 1; i <= 10; i++) { // put you range here till the last exercise id which you want to update
        exerciseURL = exerciseDataUrl + `${i}`;
        let exerciseData = await updateSingleExericisesData(exerciseURL);
        let exerciseId = exerciseData.id;
        delete exerciseData.id;

        const slugData = {
            name: exerciseData.name,
            created_at: exerciseData.created_at,
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

            console.log('👉 Returned data:', res.data);
            const { data: { id } } = res.data;
            slugId = id;
        } catch (error) {
            console.error(`😱 Axios request failed: ${error}`);
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
                console.log('👉 Returned data:', response);
                return response;
            })
            .catch(err => {
                console.log(`😱 Axios request failed: ${err}`);
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
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