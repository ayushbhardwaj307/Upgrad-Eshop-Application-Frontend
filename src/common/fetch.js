import axios from 'axios';

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api/',
});
const post_data = (endpoint, data, _headers) => {
    var header = { 'Content-Type': 'application/json', };
    if (_headers) {
        try {
            Object.entries(_headers).map(([key, value]) => {
                header[key] = value;
                return null;
            });
        } catch (_) {
        }
    }
    return apiService.post(endpoint, data, { headers: header });
};
const get_data = (endpoint,params) => {
    var header = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+logData().token
};
    return apiService.get(endpoint,{params:params},{headers:header});
};
const put_login = (endpoint,data) => {
    var header = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+logData().token
    };
    return apiService.put(endpoint,data,{headers:header});
};
const post_login = (endpoint,data) => {
    var header = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+logData().token
    };
    return apiService.post(endpoint,data,{headers:header});
};
const get_login = (endpoint) => {
    var header = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+logData().token
};
    return apiService.get(endpoint,{headers:header});
};

const delete_login = (endpoint) => {
    var header = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+logData().token
};
    return apiService.delete(endpoint,{headers:header});
};

const login_post_data = (endpoint, data) => {
        let credentials = btoa(data.username+':'+data.password)
    return apiService.post(endpoint,{},{headers:{Authorization:`Basic ${credentials}`}});
};
const logData = ()=>{
    if(localStorage.getItem('token')){
        return {
            token: localStorage.getItem('token'),
            role: localStorage.getItem('role'),
        };
    }else{
        return null
    }
}

export {logData,post_data,login_post_data,get_data,get_login,post_login,put_login,delete_login}