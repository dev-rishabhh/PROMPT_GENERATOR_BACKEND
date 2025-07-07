import User from "../model/userModel.js"
import { verifyIdToken } from "../services/googleAuthService.js";

export async function handleRegister(req, res, next) {

    const { name, email, password } = req.body
    try {
        const foundUser = await User.findOne({ email })
        if (foundUser) {
            return res.status(409).json({
                error: "User already exists",
                message: "A user with this email address already exists. Please try logging in or use a different email."
            })
        }
        await User.insertOne({
            name,
            email,
            password
        })
        res.status(200).json({ message: "registration sucessfull" })

    } catch (err) {
        if (err.code === 121) {
            res.status(400).json({ error: "Invalid input please enter a valid input" })
        } else if (err.code === 11000) {
            res.status(409).json({ error: "Email already please enter a valid input" })
        }
        next(err)
    }

}

export async function handleLogin(req, res) {
    const { email, password } = req.body
    try {
        const foundUser = await User.findOne({ email, password })

        if (!foundUser) {
            return res.status(400).json({
                error: "Invalid Credentials",
            })
        }

        const cookiePayload = JSON.stringify({
            id: foundUser._id.toString(),
            expiry: Math.round(Date.now() / 1000 + 100000),
        });


        res.cookie("token", Buffer.from(cookiePayload).toString("base64url"), {
            httpOnly: true,
            signed: true,
             sameSite:"None",
            maxAge: 60 * 1000 * 60 * 24 * 7,
        });  
        

        return res.status(200).json({
            message: "login sucessfull",
        })

    } catch (err) {
        next(err)
    }
}

export async function setUser(req, res) {
    res.status(200).json({
        name: req.user.name,
        email: req.user.email
    })
}

export function handleLogout(req, res) {
    res.clearCookie("token")
    res.status(204).end()
}

export const loginWithGoogle = async (req, res, next) => {
    const { idToken } = req.body;

    const userData = await verifyIdToken(idToken);

    const { name, email, } = userData;

    const user = await User.findOne({ email }).select("-__v");

    if (user) {
        const cookiePayload = JSON.stringify({
            id: user._id.toString(),
            expiry: Math.round(Date.now() / 1000 + 100000),
        });
        res.cookie("token", Buffer.from(cookiePayload).toString("base64url"), {
            httpOnly: true,
            signed: true,
            sameSite:"None",
            maxAge: 60 * 1000 * 60 * 24 * 7,
        });
        return res.status(200).json({
            message: "login sucessfull"
        })

    }
    console.log("User does not exist");

    try {
        const newUser=await User.insertOne({
            name,
            email,
        })

        const cookiePayload = JSON.stringify({
            id: newUser._id.toString(),
            expiry: Math.round(Date.now() / 1000 + 100000),
        });
        
        console.log(cookiePayload);
        
        res.cookie("token", Buffer.from(cookiePayload).toString("base64url"), {
            httpOnly: true,
            signed: true,
             sameSite:"None",
            maxAge: 60 * 1000 * 60 * 24 * 7,
        });

        return res.status(200).json({
            message: "login sucessfull"
        })

    } catch (err) {
        next(err);
    }
};