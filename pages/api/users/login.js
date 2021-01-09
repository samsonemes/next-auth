//db connection
import dbConnect from '../../../utils/dbConnect';

//model
const UserModel = require('../../../models/User')

//jsonwebtoken
const jwt = require('jsonwebtoken')
//access seccret
const Access_Secret = process.env.ACCESS_SECRET

//bcrypt
const bcrypt = require('bcryptjs')

//authentication
import {authenticated} from '../../middleware'; 

//connect
dbConnect()



export default async (req, res) => {
    const {method} = req
    if(method === "POST"){
        try {
            const {email, password } = req.body
            
            if(!email || !password){
                res.status(422).json({
                    message: "all fields are required"
                })
            }

            //find by email
            let user = await UserModel.findOne({
                email
            })

            if(!user){
                return res.status(422).json({
                    message: "user doen't exist"
                })

            }

            //compare password
            let isMatch = await bcrypt.compare(password, user.password)
            
            if(!isMatch){
                return res.status(422).json({
                    message: "incorrect email or password"
                })
            }

            const token = jwt.sign(
                {_id: user._id},
                Access_Secret,
                {expiresIn: "1h"}
            )

            const {_id, name} = user

            res.status(200).json({
                message: "successfully logged in",
                token, user:{_id, name}
            })
    
            
        } catch (error) {
            console.log(error)
        }

    } else {
        res.status(405).json({
            message:"we only support POST"
        })
    }
    
}