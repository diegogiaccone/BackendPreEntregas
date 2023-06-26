import { Command } from 'commander'
import dotenv from 'dotenv';

const program = new Command();

dotenv.config({path: "./.env"})

const config = {
PORT: parseInt(process.env.PORT),
WSPORT: parseInt(process.env.WSPORT),
MONGOOSE_URL: process.env.MONGOOSE_URL,
SECRET: process.env.SECRET,
JWT_TIEMPO_EXPIRA: process.env.JWT_TIEMPO_EXPIRA,
JWT_COOKIE_EXPIRES: process.env.JWT_COOKIE_EXPIRES,
GITHUB_SECRET: process.env.GITHUB_SECRET,
CLIENT_ID: process.env.CLIENT_ID,
PRODUCTS_PER_PAGE: parseInt(process.env.PRODUCTS_PER_PAGE),
BASE_URL: `http://localhost:${process.env.PORT}`
}

//console.log(config)

program
    .option(`-d`, `Variable para debug`, false)
    .option(`-p --port <port>`, `Puerto del servidor`, 3030)
    .option(`-wsp --wsport <wsport>`, `Puerto WS`, 9090)
program.parse();

const args = program.opts()

export default config