import { v2 as cloudinary } from "cloudinary"
import { unlink } from "node:fs/promises"

const uploadOnCloudinary = async (filePath) => {
  if (!filePath) {
    throw new Error("Image file path is missing")
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })

  let secureUrl
  try {
    const result = await cloudinary.uploader.upload(filePath)
    secureUrl = result.secure_url
  } catch (error) {
    try {
      await unlink(filePath)
    } catch (cleanupError) {
      console.error("Uploaded image cleanup failed:", cleanupError)
    }
    throw error
  }

  try {
    await unlink(filePath)
  } catch (cleanupError) {
    console.error("Uploaded image cleanup failed:", cleanupError)
  }

  return secureUrl
}

export default uploadOnCloudinary