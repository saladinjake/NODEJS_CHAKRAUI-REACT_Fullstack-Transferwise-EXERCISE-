/*
*@companyName: SIMBA
*@Location : Lagos Nigeria
*@Author/Developer : juwa victor/saladinjake
*@AuthorsEmail : juwavictor@gmail.com
*@description: Axios configurations
*@params:
*@usage:
*/
import axios from "axios";
import  AppError from "../../helpers/utils/AppError"
let baseURLProduction ='https://transferwise-apitest.herokuapp.com/api/v1/' // 'http://localhost:3000/api/v1/'
let baseURLDEV= 'http://localhost:3000/api/v1/'
let baseURL =  baseURLDEV
// if(process.env.NODE_ENV=="production"){
//  let baseURL =  process.env.API_END_POINT ? process.env.API_END_POINT : "http://localhost:3000/api/v1/";
// }
let token;
axios.defaults.headers.common["Content-Type"] ="application/json";
// axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
axios.defaults.headers.common['Access-Control-Allow-Origin']= "*"; //less secured
axios.defaults.headers.common['Access-Control-Allow-Methods']= 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
const instance = axios.create({
  baseURL,
});
instance.interceptors.request.use(
  function (config) {
    token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;

    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);


// Intercept all Errors
axios.interceptors.response.use(null, (err) => {
  const error = new AppError(err);

  return Promise.reject(error);
});

export default instance;