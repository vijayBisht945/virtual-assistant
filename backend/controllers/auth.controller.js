import genrateToken from '../config/token.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: 'email already exists' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'password must be greater than 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = await genrateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: false,
    });

    return res.status(201).json({
      message: 'user created successfully',
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'internal server error' });
  }
};
export const login = async (req, res) => {
  try {
    const {  email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'email does not  exists' });
    }

    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
            return res.status(400).json({ message: 'password is does not match' });
    }

    const token = await genrateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      secure: false,
    });

    return res.status(200).json({
      message: 'user login successfully',
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: 'internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
     res.clearCookie("token")
     return res.status(200).json({message:"logout is succesfully "})

    
  } catch (err) {
    return res.status(500).json({ message: 'internal server error' });
  }
};

