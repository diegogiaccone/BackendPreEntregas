import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 


const createHash = (pass) => {
    return bcrypt.hash(pass, bcrypt.genSaltSync(10));
}

const isValidPassword = (passInDb, passToCompare) => {
    return bcrypt.compare(passToCompare, passInDb);
}

export { __filename, __dirname, createHash, isValidPassword };