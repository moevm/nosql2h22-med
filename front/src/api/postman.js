// 
import axios from 'axios';

// export function getHospitals() {
//     // eslint-disable-next-line react-hooks/rules-of-hooks
    

//     const apiURL = "http://127.0.0.1:5000/medical";

//     const fetchData = async () => {
//         const response = await axios.get(apiURL)

//         const hospitals = response.data;

//         alert(hospitals)
//     };

//     return hospitals;
// }

export const getPosts = async (value) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
    // axios.get('https://api.npms.io/v2/search?q=react')
    //     .then(response => this.setState({ totalReactPackages: response.data.total }));
    // eslint-disable-next-line react-hooks/rules-of-hooks


    const apiURL = "http://127.0.0.1:5000/medical?search=" + value;
    const response = await axios.get(apiURL, headers)

    return response
    // const response = await axios.get(apiURL, headers)

    // const hospitals = response.data;

    // return hospitals
    // let headers = {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    // }
    // let ret = fetch('http://127.0.0.1:5000/medical', config.headers)
    //
    //
    // return JSON.parse(ret)
    // return require("./resources.json")
}