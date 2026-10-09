
import jwt from 'jsonwebtoken'
const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "token does not exist" })
        }

        const isVerify = await jwt.verify(token, process.env.JWT_SECRATE_KEY)
        req.userId = isVerify.userId;
        next()
    }
    catch (err) {
        return res.status(400).json({ message: "authentication problem occurred" })
    }
}

export default isAuth
