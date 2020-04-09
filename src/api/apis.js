var axios = require("axios");
var data_url = "http://13.250.204.142:3000/"
var near_url = "http://13.250.204.142:3030"

export function postUrl(method,params){
    return  axios.post(near_url,{
        "jsonrpc":"2.0",
        "method":method,
        "params":params,
        "id":"dontacare"})
}

export function latestMesg(){
    return axios({
        method: 'GET',
        url : data_url + 'api/common/getLatestMesg',
        params:{}
    })
}

export function blockList(page){
    return axios({
        method: 'GET',
        url: data_url + 'api/block/getBlockList',
        params:{
            "page":page
        }
    })
}

export function txList(page){
    return axios({
        method: 'GET',
        url : data_url + 'api/transaction/getTxListOrByAccount',
        params:{
            "page":page
        }
    })
}