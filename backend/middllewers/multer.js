import multer,{ diskStorage } from "multer"
import { fileURLToPath } from "node:url"

const uploadDirectory = fileURLToPath(new URL("../public/", import.meta.url))
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,uploadDirectory)
  },
  filename:(req,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({storage})

export default upload