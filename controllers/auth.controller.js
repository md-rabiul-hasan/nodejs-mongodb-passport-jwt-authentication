require('dotenv').config();
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const User = require('./../models/user')



exports.singup = async (req, res) => {
    try{
        const user = await User.findOne({
            email: req.body.email
        });
        if(user) {
            return res.status(400).send("Email is already registered");
        }

        bcrypt.hash(req.body.password, process.env.SALT_RANDOM, async(err, hash) => {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
            await newUser.save()
                        .then((user) => {
                            res.status(200).send({
                                success: true,
                                message: "User saved successfully",
                                user: {
                                    id: user._id,
                                    username: user.username,
                                    email: user.email
                                }
                            })
                        })
                        .catch((err) => {
                            res.send({
                                success: false,
                                message: "user is not created",
                                error: err.message
                            });
                        })
        });



    }catch(error){
        res.status(500).send(error.message);
    }
}

exports.login = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    });
    console.log(user);
    if(!user){
        return res.status(401).send({
            success: false,
            message: 'User not found'
        });
    }

    if(!bcrypt.compareSync(req.body.password, user.password)){
        return res.status(401).send({
            success: false,
            message: 'Password mismatch'
        });
    }

    const payload = {
        id: user._id,
        username: user.username,
        email: user.email
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRE_IN
    });

    return res.status(200).send({
        success: true,
        message: "User is logged in successfully",
        token_type: "Bearer",
        access_token: token
    });
}

exports.profile = (req, res) => {
    return res.status(200).send({
        success: true,
        user: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email
        },
    });
}