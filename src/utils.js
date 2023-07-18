import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';
import {Faker, en} from '@faker-js/faker'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const faker = new Faker({locale: en})

export const generateUser = () => {
    let products = [];
    const productsQty = parseInt(faker.number.int(20));
    for (let i = 0; i < productsQty; i++) { products.push(generateProduct()); }

    const role = parseInt(faker.number.int(1)) === 1 ? 'client': 'seller';

    return {
        id: faker.database.mongodbObjectId(),
        code: faker.string.alphanumeric(8),
        name: faker.person.firstName(),
        last_name: faker.person.lastName,
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        email: faker.internet.email(),
        role: role,
        premium: faker.datatype.boolean(),
        current_job: faker.person.jobType(),
        zodiac_sign: faker.person.zodiacSign(),
        products: products
    }
}

const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        stock: faker.number.int(50),
        image: faker.image.urlLoremFlickr(),
        description: faker.commerce.productDescription()
    }
}

export const errorsDict = {
    ROUTING_ERROR: { code: 404, msg: 'No se encuentra el end point solicitado' },
    INVALID_TYPE_ERROR: { code: 400, msg: 'No corresponde el tipo de dato' },
    DATABASE_ERROR: { code: 500, msg: 'No se puede conectar a la base de datos' },
    INTERNAL_ERROR: { code: 500, msg: 'Error interno de ejecución del servidor' }
}


const createHash = (pass) => {
    return bcrypt.hash(pass, bcrypt.genSaltSync(10));
}

const isValidPassword = (passInDb, passToCompare) => {
    return bcrypt.compare(passToCompare, passInDb);
}

export { __filename, __dirname, createHash, isValidPassword };