import axios from "axios"
import qs from "qs"
import FormData from "form-data"
import {uaRandom} from "./ua"
axios.defaults.baseURL = "https://www.dalaochongqibuni.com"

interface parameterUpData {
    articleid: string,
    chapterid: string,
    pid: string
}

export const title = (url:string) => {
    // 获取 文章url 和文章title
    return axios.request({
        url:url,
        method: "GET",
        headers: {
            "User-Agent":uaRandom
        }
    })
}


export const text = (data: parameterUpData) => {
    // 获取正文
    let data1 = qs.stringify(data)
    return axios.request({
        url: "/api/reader_js.php?",
        method: "POST",
        data: data1,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "User-Agent":uaRandom
        }
    })
}


export const nameInput = (nameData: string) => {
    // 搜索文章
    let data:any = {
        searchkey: nameData,
        Submit: ""
    }
    let data1 = new FormData()
    for (const key in data) {
        data1.append(key,data[key])
    }
    return axios.request({
        url: "/search/",
        method: "POST",
        data:data1,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            "User-Agent":uaRandom
        }
    })
} 

export const nameList = (url:string)=>{
    //文章列表获取
    return axios.request({
        url:url,
        method:"GET",
        headers: {
            "User-Agent":uaRandom
        }
    })
}