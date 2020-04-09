import axios from "axios";
export function fetch(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: process.env.VUE_APP_BASE_URL,
      //baseURL: "https://filscan.io/:8700/v0/filscan",
      timeout: 100000
    });
    // const instance_base = axios.create({
    //   baseURL: "http://13.250.204.142:3000",
    //   //baseURL: "https://filscan.io/:8700/v0/filscan",
    //   timeout: 100000
    // });
    instance.interceptors.response.use(
      response => {
        let data;
        if (response.data === undefined) {
          data = response.request.responseText;
        } else {
          data = response.data;
        }
        return data.data || data;
      }, 
      err => {
        return Promise.reject(err);
      }
    );
    instance(options)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
