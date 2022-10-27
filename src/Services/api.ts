import axios from 'axios';
import { useContext } from 'react';
import AuthContext from '../Context/auth';

const api = axios.create({
    baseURL: 'https://controle-interno.azurewebsites.net/api/'
});

axios.interceptors.request.use((config:any) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("@App:token")}`;
    return config;
 });

axios.interceptors.response.use(response => {
    return response;
 }, error => {
   if (error.response.status === 401) {
    //place your reentry code
   }
   return error;
});

export default api;
