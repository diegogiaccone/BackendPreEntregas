import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';
import {Faker, en} from '@faker-js/faker'
import { transport } from "./config/mail.config.js";


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

export const pdf =  (code, date2, date3, Total) => {
    return `<body>
            <div>
                <div style="text-align:center">
                    <h2>FunkoPop Ticket</h2>
                </div>
                <div>
                    <h4>Codigo del Ticket: ${code}</h4>
                    <h4>Fecha: ${date2}</h4>
                    <h4>usuario: ${date3}</h4>                                                         
                    <h4>Precio total: $ ${Total}</h4>
                    <h4>Muchas Gracias por su compra</h4>
                        <div style="display:flex; justify-content:center;">
                            <img src="https://i.postimg.cc/65D2wVCC/imagen.png" alt="">
                                   <img src="https://i.postimg.cc/hPD6YcWq/favicon.png" alt="">
                               </div>
                           </div>
                       </div>
                   </body>` 
}

export const getMail = (code, date4) => {
    return transport.sendMail({
        from: 'FunkoPops <diegogiaccone35@gmail.com>',
        to: date4,
        subject: 'Ticket de Compra',
        html: `
            <h1><b>Muchas Gracias por su compra</b></h1>
            <p style="color: #f00;">
                <b>Funko Pops</b><br>
                <img src="https://i.postimg.cc/sDGCFRXQ/favicon.png" />
            </p>
        `,
        attachments: [
            { filename: 'ticket.pdf', path: `${__dirname}/public/tickets/${code}.pdf`, cid: 'ticket.pdf' },            
        ]
    })}

const createHash = (pass) => {
    return bcrypt.hash(pass, bcrypt.genSaltSync(10));
}

const isValidPassword = (passInDb, passToCompare) => {
    return bcrypt.compare(passToCompare, passInDb);
}

export { __filename, __dirname, createHash, isValidPassword };