import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

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
    const { email, password } = req.body;

    if(!email || !password) {
        throw new BadRequestError('please provide all values');
    }
    
    const user = await User.findOne({ email }).select('+password')
    if(!user) {
        throw new UnAuthenticatedError('Invalid Credentials');
    }
    console.log(user)

    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        throw new UnAuthenticatedError('Invalid Credentials');
    }
    const token = user.createJWT()
    user.password = undefined
    res.status(StatusCodes.OK).json({
        user, 
        token, 
        location: user.location
    })

    res.send('login User')
}

const update = async (req, res) => {
    console.log(req.user)
    res.send('update User')
}

export { register, login, update }