import jwt from 'jsonwebtoken'
const genrateToken = async(userId)=>{
    const token = await jwt.sign({userId},process.env.JWT_SECRATE_KEY,{
        expiresIn:"7d"
    })
    return token;
        
}


export default genrateToken