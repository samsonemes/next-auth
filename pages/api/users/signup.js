//db connection
import dbConnect from '../../../utils/dbConnect';

//model
const UserModel = require('../../../models/User')

//jsonwebtoken
const jwt = require('jsonwebtoken')

//bcrypt
const bcrypt = require('bcryptjs')

//connect
dbConnect()

export default async (req, res) => {
    const {method} = req
    if(method === "POST"){
        try {
            const {name, email, password} = req.body
            
            if(!name || !email || !password){
                res.status(422).json({
                    message: "all fields are required"
                })
            }

            //find by email
            let user = await UserModel.findOne({
                email
            })

            if(user){
                res.status(422).json({
                    message: "user already exists"
                })
            }

            user = new UserModel({
                name,
                email,
                password
            })

            //hash password
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)
               
            await user.save()

            res.status(200).json({
                message: "account created successfully"
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