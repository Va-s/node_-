import { createLogger, format, transports } from 'winston'
import "winston-daily-rotate-file"
// 日志打印输出格式
const customFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    // format.align(),
    format.colorize(),
    format.printf((i) => `>${i.level}: ${[i.timestamp]}: ${i.message}\n`),
);
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
export const logger = createLogger({
    format: customFormat,
    transports: [
        new transports.DailyRotateFile({
            filename: "logs/%DATE%.log",
            level: "info",
            ...defaultOptions,
        }),
    ]
});
// 方法2：日志输出在控制台
export const consoleLog = createLogger({
    format: customFormat,
    transports: [new transports.Console()]
});