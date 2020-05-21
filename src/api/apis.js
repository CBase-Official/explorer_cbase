var axios = require("axios");
// var data_url = "http://112.74.106.123:3000/"
// var near_url = "http://112.74.106.123:3030";

// var data_url = "http://47.57.7.136:3000/"
var near_url = "http://18.163.235.28:3030"

// var data_url = "http://192.168.80.54:3000/"
var data_url = "http://192.168.1.104:3000/"
// var near_url = "http://192.168.80.54:3030"
// var data_url = "http://47.90.101.201:3000/";
// var near_url = "http://47.90.101.201:3030"


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
            "page": page
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
export function txListByAccountId(page, account_id){
    return axios({
        method: 'GET',
        url : data_url + 'api/transaction/getTxListOrByAccount',
        params:{
            "page":page,
            "account_id":account_id
        }
    })
}

export function getTxByHeight(page, nums){
    return axios({
        method: 'GET',
        url : data_url + 'api/transaction/getTxByHeight',
        params:{
            "page":page,
            "height":nums
        }
    })
}

export function getBlockByHeight(nums) {
    return axios({
        method: 'GET',
        url: data_url + "api/block/getHeaderByHeight",
        params:{
            "height":nums
        }
    })
}

export function getTxByHash(tx) {
    return axios({
        method: 'GET',
        url: data_url + 'api/transaction/getTxByHash',
        params: { "hash": tx, }
    });
}

export function getTxListByChunkHash(tx) {
    return axios({
        method: 'GET',
        url: data_url + 'api/transaction/getTxByChunkHash',
        params: { "hash": tx, }
    });
}

export function getTxListByHeaderHash(tx, options) {
    console.log("tx:",tx);
    console.log("o;;",options.page)
    return axios({
        method: 'GET',
        url: data_url + 'api/transaction/getTxByHeaderHash',
        params: { "hash": tx, "page": options.page}
    });
}

export function getChunkByHash(hash) {
    return axios({
        method: 'GET',
        url: data_url + 'api/block/getChunkByHash',
        params: { "hash": hash, }
    });
}

export function getBlockByHash(hash) {
    return axios({
        method: 'GET',
        url: data_url + 'api/block/getBlockByHash',
        params: { "hash": hash, }
    })
}

export function getAccountById(account) {
    return axios({
        method: 'GET',
        url: data_url + 'api/account/getAccount',
        params: { "account": account, }
    })
}

export function search(keys) {
    return axios({
        method: 'GET',
        url: data_url + 'api/common/searchTarget',
        params: { "keys": keys }
    })
}

export function getBlockTimeData() {
    return axios({
        method: 'GET',
        url: data_url + 'api/common/avgTime',
        params: {}
    })
}

export function getMessage(options){
    console.log("option:",options)
    return axios({
        method: 'GET',
        url: data_url + 'api/transaction/getTxListOrByAccount',
        params: {"page":options.page}
    })
}
