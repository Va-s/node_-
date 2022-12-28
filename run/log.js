"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLog = exports.logger = void 0;
const winston_1 = require("winston");
require("winston-daily-rotate-file");
// 日志打印输出格式
const customFormat = winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), 
// format.align(),
winston_1.format.colorize(), winston_1.format.printf((i) => `>${i.level}: ${[i.timestamp]}: ${i.message}\n`));
// 日志写入文件配置
const defaultOptions = {
    format: customFormat,
    datePattern: "YYYY-MM-DD",
    zippedArchive: false,
    maxSize: "10m",
    // maxFiles: "14d",
};
// 可以定义多个日志方法
// 方法1：日志输出成文件（每日滚动日志文件）
exports.logger = (0, winston_1.createLogger)({
    format: customFormat,
    transports: [
        new winston_1.transports.DailyRotateFile(Object.assign({ filename: "logs/%DATE%.log", level: "info" }, defaultOptions)),
    ]
});
// 方法2：日志输出在控制台
exports.consoleLog = (0, winston_1.createLogger)({
    format: customFormat,
    transports: [new winston_1.transports.Console()]
});
