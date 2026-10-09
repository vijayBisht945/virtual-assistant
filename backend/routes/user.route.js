import express from 'express'
const userrouter = express.Router();
import { getUser,updateAssistantImage ,geminiGetResponse } from '../controllers/user.controllers.js'
import isAuth from '../middllewers/isAuth.js';
import upload from '../middllewers/multer.js'

userrouter.get('/user',isAuth,getUser)
userrouter.post('/update',isAuth,upload.single('assistantimage'),updateAssistantImage)
userrouter.post('/asktoassistant',isAuth,geminiGetResponse)

export default userrouter;