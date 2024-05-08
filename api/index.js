import axios from 'axios'

const API_KEY = '43776080-dfe2e3a744cfc40640c2fd144';
const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl = (params) => {
    let url =  apiUrl + "&per_page=25&safesearch=true&editors_choice=true"
    console.log('final url: ', url);
    if(!params) return url

    let paramsKey = Object.keys(params);
    paramsKey.map(key => {
        let value = key == 'q' ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    });

    console.log('final url: ', url);
    return url;

}

export const apiCall = async (params) => {
    try {
        const response = await axios.get(formatUrl(params))
        const { data } = response;

        return { success: true, data}
    } catch (err) {
        console.log(err.message)
        return { success: false, msg: err.message }
    }
}