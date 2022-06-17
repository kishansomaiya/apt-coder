import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://apt-coder.herokuapp.com/',
})