const axios = require('axios');
const updateSingleExericisesData = require('./updateExercises');

let exerciseDataUrl = `https://merp-strapi.merakilearn.org/api/exercises/`;


const postBaseURL = 'http://3.110.213.190/api';
const BEARER_TOKEN = '';

let exerciseURL
const updateExercisesData = async () => {
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
        const slugData = {
            name: `exercise-${exerciseId}-${code}`,
            type: exerciseData.type,
            slug: `exercise-${exerciseId}-${code}`,
            created_by_id: null,
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