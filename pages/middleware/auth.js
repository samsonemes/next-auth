import { verify } from 'jsonwebtoken';
const Access_Secret = process.env.ACCESS_SECRET;

export const authenticated = fn => async (req, res) => {
    verify(req.headers.authorization, Access_Secret, async function(err, decoded){
        //err
        if(!err && decoded){
            return await fn(req, res)
        }
        //decoded undefined
        res.status(422).json({
            message: "Unauthorized"
        })
    });
    
}