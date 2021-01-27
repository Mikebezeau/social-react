const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config.js');

const { validateRegisterInput, validateLoginInput } = require('../../util/validation');
const User = require('../../models/User');
const { UserInputError } = require('apollo-server');

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY,
        { expiresIn: '1h'}
    );
}

module.exports = {
    Mutation: {
        async login(_, { username, password }, context, info){
            //validate login info
            const { valid, errors } = validateLoginInput(username, password);
            if(!valid){
                throw new UserInputError('Invalid login information', { errors });
            }

            const findUser = await User.findOne({ username });
            if(!findUser){
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors })
            }

            const match = await bcrypt.compare(password, findUser.password);
            if(!match){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToken(findUser);

            return{
                ...findUser._doc,
                id: findUser._id,
                token
            };
        },

        async register(_, { registerInput: { username, email, password, confirmPassword } }, context, info){
            // validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', { errors });
            }
            // make sure user dosn't already exists
            const findUser = await User.findOne({ username });
            if(findUser){
                throw new UserInputError('User name is taken', {
                    errors: {
                        username: 'This user name is taken'
                    }
                });
            }

            // async hash password, create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);
            
            return{
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
}