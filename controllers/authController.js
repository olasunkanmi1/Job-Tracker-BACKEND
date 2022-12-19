import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js'

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        throw new BadRequestError('please provide all values');
    }

    const  userAlreadyExists = await User.findOne({ email });
    if(userAlreadyExists) {
        throw new BadRequestError('Email already exist');
    }
    
    const user = await User.create({ name, email, password });
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({
        user: {
            email: user.email, 
            name: user.name,
            lastName: user.lastName,
            location: user.location
        }, 
        token, 
        location: user.location
    })
}

const login = async (req, res) => {
    res.send('login User')
}

const update = async (req, res) => {
    res.send('update User')
}

export { register, login, update }