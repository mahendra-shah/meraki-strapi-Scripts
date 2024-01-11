const axios = require('axios');
const updateSingleExericisesData = require('./updateExercises');

let exerciseDataUrl = `https://merp-strapi.merakilearn.org/api/exercises/`;


const postBaseURL = 'http://3.110.213.190/api';
const BEARER_TOKEN = '97194fcf58ac129f284485aede83cac7e662c5a50af07162c84c22575c392b60ebd3b3ffeb3afe7a7a8e26cc1d6f2b6943fe0c542f04dabb4febbf0069fcf02353462266c7192f7ba04bd3a3d3e07d256feee16f106501772a0078e57a49df6196922b936189bc6e1b74ce2bbaecfe8fbbfd0bcb145ace48e224f872fcf8d1c8';

let exerciseURL
const updateExercisesData = async () => {
    for (let i = 1; i <= 14; i++) { // put you range here till the last exercise id which you want to update
        exerciseURL = exerciseDataUrl + `${i}`;
        let exerciseData = await updateSingleExericisesData(exerciseURL);
        let exerciseId = exerciseData.id;
        delete exerciseData.id;

        const slugData = {
            name: exerciseData.name,
            created_at: exerciseData.created_at,
            type:exerciseData.type,
            slug:exerciseData.name,
            updated_at: exerciseData.updated_at,
            published_at: exerciseData.published_at,
            created_by_id: null,
            updated_by_id: null
        };
        let slugFormatedData = {
            data: slugData
        }
        console.log(slugFormatedData,"slugFormatedData");
        let slugId;
        try {
            const res = await axios.post(`${postBaseURL}/slugs`, slugFormatedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'version-code': '5050505',
                    Authorization: `Bearer ${BEARER_TOKEN}`
                }
            });

            console.log('👉 Returned data:', res.data.data);
            const { data: { id } } = res.data;
            slugId = id;
        } catch (error) {

            console.error(`😱gggggggg Axios request failed: ${error.message}`);
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