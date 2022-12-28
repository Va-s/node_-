import { nameInput, nameList, text, title } from './api/dataOne'
import cheerio from "cheerio"
import readline from "readline";
import fs from "fs";
import { logger,consoleLog } from "./log"


interface parameterUpData {
    articleid: string,
    chapterid: string,
    pid: string
}
let textTitle: string

export const nameInputfun = async (nameData: string) => {
    // 搜索文章 展示
    try {
        let data = await nameInput(nameData)
        logger.info("搜索文章成功");
        const $ = cheerio.load(data.data)
        let dataList: { wordNmae: string; wordSubNmae: string; aName: string | undefined; }[] = []
        $('.category-div div div.commend-title').each(function () {
            let div = $(this)
            dataList.push({
                "wordNmae": div.children("a").text(),
                "wordSubNmae": div.children("span").text(),
                "aName": div.children("a").attr("href")
            })
        })
        dataList.forEach((element, i) => {
            consoleLog.log('info',`序号${i} 书名${element.wordNmae} 作者${element.wordSubNmae}`)
        });
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(`输入书籍序号? `, (wordNameIndex) => {
            textTitle = `${dataList[Number(wordNameIndex)].wordNmae}`
            logger.info(`爬取${dataList[Number(wordNameIndex)].wordNmae}`)
            consoleLog.log('info',`爬取${dataList[Number(wordNameIndex)].wordNmae}`)
            nameListFun(`${dataList[Number(wordNameIndex)].aName}`)
            fs.writeFile(`./${textTitle}.txt`, ``, function (err) {
                if (err) {
                    return logger.error(err)
                }
                logger.info('文件写入成功')
            })
            rl.close();
        });
    } catch (error) {
        logger.error("搜索文章失败\n"+error);
    }

}


const nameListFun = async (aName: string) => {
    // 获取第一个文章url地址
    try {
        let { data } = await nameList(aName)
        logger.info("获取文章第一个url成功")
        const $ = cheerio.load(data)
        let a = $("div.mb20 div.info-chapters a:first")
        titleFun(`${a.attr("href")}`)
    } catch (error) {
        logger.error("获取文章第一个url失败\n"+error);
    }

}

const titleFun = async (href: string) => {
    // 文章链接处理
    try {
        let { data } = await title(href)
        const $ = cheerio.load(data)
        let href2 = href.split("/")
        let textData: parameterUpData = {
            articleid: href2[href2.length - 2],
            chapterid: href2[href2.length - 1].split('.')[0].split('_')[0],
            pid: href2[href2.length - 1].split('.')[0].split('_')[1] as string | '1'
        }
        let textMainBody = $("h1").text().replace(/\s+/g, "");
        textFun(textData, textMainBody)
        consoleLog.log("info",`正在爬取${textMainBody}`)
        logger.info(`爬取${textMainBody}`)
        // if(`${$('#next_url').attr("href")}` == "javascript:void(0);") return 
        setTimeout(async function () {
            await titleFun(`${$('#next_url').attr("href")}`)
        }, 500)
    } catch (error) {
        logger.error("文章链接获取失败\n"+error);
        logger.error("文章链接获取失败\n"+href);
        let { data } = await title(href)
        const $ = cheerio.load(data)
        let href2 = href.split("/")
        let textData: parameterUpData = {
            articleid: href2[href2.length - 2],
            chapterid: href2[href2.length - 1].split('.')[0].split('_')[0],
            pid: href2[href2.length - 1].split('.')[0].split('_')[1] as string | '1'
        }
        let textMainBody = $("h1").text().replace(/\s+/g, "");
        consoleLog.log("info",`正在爬取${textMainBody}`)
        textFun(textData, textMainBody)
        // if(`${$('#next_url').attr("href")}` == "javascript:void(0);") return 
        await titleFun(`${$('#next_url').attr("href")}`)
    }

}

const textFun = async (textData: parameterUpData, textMainBody: string) => {
    try {
        let { data } = await text(textData)
        logger.info("正文获取成功")
        const $ = cheerio.load(data)
        fs.appendFile(`./${textTitle}.txt`, `${textMainBody}\n${$("p").text()}\n`, function (err) {
            if (err) {
                return logger.error(err)
            }
            logger.info('文件写入成功')
        })
    } catch (error) {
        logger.error("正文获取失败\n" + error);
        let { data } = await text(textData)
        logger.info("正文获取成功")
        const $ = cheerio.load(data)
        fs.appendFile(`./${textTitle}.txt`, `${textMainBody}\n${$("p").text()}\n`, function (err) {
            if (err) {
                return logger.error(err)
            }
            logger.info('文件写入成功')
        })
    }

}
