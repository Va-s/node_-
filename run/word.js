"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameInputfun = void 0;
const dataOne_1 = require("./api/dataOne");
const cheerio_1 = __importDefault(require("cheerio"));
const readline_1 = __importDefault(require("readline"));
const fs_1 = __importDefault(require("fs"));
const log_1 = require("./log");
let textTitle;
const nameInputfun = (nameData) => __awaiter(void 0, void 0, void 0, function* () {
    // 搜索文章 展示
    try {
        let data = yield (0, dataOne_1.nameInput)(nameData);
        log_1.logger.info("搜索文章成功");
        const $ = cheerio_1.default.load(data.data);
        let dataList = [];
        $('.category-div div div.commend-title').each(function () {
            let div = $(this);
            dataList.push({
                "wordNmae": div.children("a").text(),
                "wordSubNmae": div.children("span").text(),
                "aName": div.children("a").attr("href")
            });
        });
        dataList.forEach((element, i) => {
            log_1.consoleLog.log('info', `序号${i} 书名${element.wordNmae} 作者${element.wordSubNmae}`);
        });
        const rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(`输入书籍序号? `, (wordNameIndex) => {
            textTitle = `${dataList[Number(wordNameIndex)].wordNmae}`;
            log_1.logger.info(`爬取${dataList[Number(wordNameIndex)].wordNmae}`);
            log_1.consoleLog.log('info', `爬取${dataList[Number(wordNameIndex)].wordNmae}`);
            nameListFun(`${dataList[Number(wordNameIndex)].aName}`);
            fs_1.default.writeFile(`./${textTitle}.txt`, ``, function (err) {
                if (err) {
                    return log_1.logger.error(err);
                }
                log_1.logger.info('文件写入成功');
            });
            rl.close();
        });
    }
    catch (error) {
        log_1.logger.error("搜索文章失败\n" + error);
    }
});
exports.nameInputfun = nameInputfun;
const nameListFun = (aName) => __awaiter(void 0, void 0, void 0, function* () {
    // 获取第一个文章url地址
    try {
        let { data } = yield (0, dataOne_1.nameList)(aName);
        log_1.logger.info("获取文章第一个url成功");
        const $ = cheerio_1.default.load(data);
        let a = $("div.mb20 div.info-chapters a:first");
        titleFun(`${a.attr("href")}`);
    }
    catch (error) {
        log_1.logger.error("获取文章第一个url失败\n" + error);
    }
});
const titleFun = (href) => __awaiter(void 0, void 0, void 0, function* () {
    // 文章链接处理
    try {
        let { data } = yield (0, dataOne_1.title)(href);
        const $ = cheerio_1.default.load(data);
        let href2 = href.split("/");
        let textData = {
            articleid: href2[href2.length - 2],
            chapterid: href2[href2.length - 1].split('.')[0].split('_')[0],
            pid: href2[href2.length - 1].split('.')[0].split('_')[1]
        };
        let textMainBody = $("h1").text().replace(/\s+/g, "");
        textFun(textData, textMainBody);
        log_1.consoleLog.log("info", `正在爬取${textMainBody}`);
        log_1.logger.info(`爬取${textMainBody}`);
        // if(`${$('#next_url').attr("href")}` == "javascript:void(0);") return 
        setTimeout(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield titleFun(`${$('#next_url').attr("href")}`);
            });
        }, 500);
    }
    catch (error) {
        log_1.logger.error("文章链接获取失败\n" + error);
        log_1.logger.error("文章链接获取失败\n" + href);
        let { data } = yield (0, dataOne_1.title)(href);
        const $ = cheerio_1.default.load(data);
        let href2 = href.split("/");
        let textData = {
            articleid: href2[href2.length - 2],
            chapterid: href2[href2.length - 1].split('.')[0].split('_')[0],
            pid: href2[href2.length - 1].split('.')[0].split('_')[1]
        };
        let textMainBody = $("h1").text().replace(/\s+/g, "");
        log_1.consoleLog.log("info", `正在爬取${textMainBody}`);
        textFun(textData, textMainBody);
        // if(`${$('#next_url').attr("href")}` == "javascript:void(0);") return 
        yield titleFun(`${$('#next_url').attr("href")}`);
    }
});
const textFun = (textData, textMainBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { data } = yield (0, dataOne_1.text)(textData);
        log_1.logger.info("正文获取成功");
        const $ = cheerio_1.default.load(data);
        fs_1.default.appendFile(`./${textTitle}.txt`, `${textMainBody}\n${$("p").text()}\n`, function (err) {
            if (err) {
                return log_1.logger.error(err);
            }
            log_1.logger.info('文件写入成功');
        });
    }
    catch (error) {
        log_1.logger.error("正文获取失败\n" + error);
        let { data } = yield (0, dataOne_1.text)(textData);
        log_1.logger.info("正文获取成功");
        const $ = cheerio_1.default.load(data);
        fs_1.default.appendFile(`./${textTitle}.txt`, `${textMainBody}\n${$("p").text()}\n`, function (err) {
            if (err) {
                return log_1.logger.error(err);
            }
            log_1.logger.info('文件写入成功');
        });
    }
});
