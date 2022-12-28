"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameList = exports.nameInput = exports.text = exports.title = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const form_data_1 = __importDefault(require("form-data"));
const ua_1 = require("./ua");
axios_1.default.defaults.baseURL = "https://www.dalaochongqibuni.com";
const title = (url) => {
    // 获取 文章url 和文章title
    return axios_1.default.request({
        url: url,
        method: "GET",
        headers: {
            "User-Agent": ua_1.uaRandom
        }
    });
};
exports.title = title;
const text = (data) => {
    // 获取正文
    let data1 = qs_1.default.stringify(data);
    return axios_1.default.request({
        url: "/api/reader_js.php?",
        method: "POST",
        data: data1,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            "User-Agent": ua_1.uaRandom
        }
    });
};
exports.text = text;
const nameInput = (nameData) => {
    // 搜索文章
    let data = {
        searchkey: nameData,
        Submit: ""
    };
    let data1 = new form_data_1.default();
    for (const key in data) {
        data1.append(key, data[key]);
    }
    return axios_1.default.request({
        url: "/search/",
        method: "POST",
        data: data1,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            "User-Agent": ua_1.uaRandom
        }
    });
};
exports.nameInput = nameInput;
const nameList = (url) => {
    //文章列表获取
    return axios_1.default.request({
        url: url,
        method: "GET",
        headers: {
            "User-Agent": ua_1.uaRandom
        }
    });
};
exports.nameList = nameList;
