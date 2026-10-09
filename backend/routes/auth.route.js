import express from 'express'
import { signUp,login,logout} from '../controllers/auth.controller.js'
import upload from '../middllewers/multer.js'

const authrouter = express.Router()

authrouter.post('/sign',signUp)
authrouter.post('/login',login)
authrouter.post('/logout',logout)


export default authrouter