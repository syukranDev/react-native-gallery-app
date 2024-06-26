import axios from 'axios'

const API_KEY = process.env.EXPO_PUBLIC_API_IMAGE_KEY
const apiUrl = process.env.EXPO_PUBLIC_API_IMAGE_URL + `?key=${API_KEY}`

const formatUrl = (params) => {
    let url =  apiUrl + "&per_page=25&safesearch=true&editors_choice=true"
    if(!params) return url

    let paramsKey = Object.keys(params);
    paramsKey.map(key => {
        let value = key == 'q' ? encodeURIComponent(params[key]) : params[key];
        url += `&${key}=${value}`;
    });

    return url;
    
}

export const apiCall = async (params) => {
    try {
        const response = await axios.get(formatUrl(params))
        const { data } = response;
        
        console.log('final url ===> ', formatUrl(params));
        return { success: true, data}
    } catch (err) {
        console.log(err.message)
        return { success: false, msg: err.message }
    }
}