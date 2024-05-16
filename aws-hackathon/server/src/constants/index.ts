import * as dotenv from 'dotenv'
dotenv.config()

export default {
    // Database variables 
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    DATABASE: process.env.DATABASE,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,

    // Server variables
    SERVER_PORT: process.env.SERVER_PORT,
    CLIENT_PORT: process.env.CLIENT_PORT,
    SECRET: process.env.SECRET,
    CLIENT_HOST: process.env.CLIENT_HOST,
    SERVER_HOST: process.env.SERVER_HOST,

    // Misc variables
    EMAIL_SMTP: process.env.EMAIL_SMTP,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    SMTP_PORT: process.env.SMTP_PORT,
    NODE_ENV: process.env.NODE_ENV,
}