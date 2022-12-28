import {nameInputfun} from "./word"
import readline from "readline";





async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(`输入书籍名称? `, (name) => {
        nameInputfun(name)
        rl.close();
    });
}

main()














