import User from "../model/userModel.js";

export default async function checkAuth(req, res, next) {
    
    const { token } = req.signedCookies;

    if (!token) {
        res.clearCookie("token");
        return res.status(401).json({ error: "Not token" })
    }
    const { id, expiry: expiryTimeInSeconds } = JSON.parse(
        Buffer.from(token, "base64url").toString()
    );

    const currentTimeInSeconds = Math.round(Date.now() / 1000);


    if (currentTimeInSeconds > expiryTimeInSeconds) {
        res.clearCookie("token");
        return res.status(401).json({ error: "Timeout in!" });
    }
    const user = await User.findOne({ _id: id })

    if (!user) {
        return res.status(401).json({ error: "No user found" })
    }
    req.user = user
    next()
}