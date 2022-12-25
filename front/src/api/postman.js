// 
import axios from 'axios';
import { AiOutlineConsoleSql } from 'react-icons/ai';

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

export const getMedicalbyId = async (id) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }

    const apiURL = "http://127.0.0.1:5000/medical/" + id;

    const response = await axios.get(apiURL, headers)

    return response
}

export const getCities = async () => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }

    const apiURL = "http://127.0.0.1:5000/internal/getCities";
    const response = await axios.get(apiURL, headers)

    return response
}

export const getSpecialties = async () => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }

    const apiURL = "http://127.0.0.1:5000/internal/getSpecialties";
    const response = await axios.get(apiURL, headers)

    return response
}

export const getPosts = async (searchValue, specializationFilter, cityFilter, timeFilter, sortAttribute) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }

    var apiURL = "http://127.0.0.1:5000/medical"
    if (searchValue === "" && specializationFilter === "" && cityFilter === "" && timeFilter === "" && sortAttribute === "") {
    }
    else {
        apiURL += "?";
        if (specializationFilter !== "" || cityFilter !== "" || timeFilter !== "") {
            apiURL += "filters=";

            if (specializationFilter !== "" ) {
                apiURL += "specialties:" + specializationFilter + ",";
            }
            if (cityFilter !== "" ) {
                apiURL += "regionName:" + cityFilter + ",";
            }
            if (timeFilter !== "" ) {
            }

            apiURL = apiURL.slice(0, -1) + "&"
        }

        if (sortAttribute !== "") {
            apiURL += "sort=" + sortAttribute + ":1&";
        }

        if (searchValue !== "") {
            apiURL += "search=" + searchValue + "&";
            
        }

        apiURL = apiURL.slice(0, -1);
    }

    const response = await axios.get(apiURL, headers)

    return response
}