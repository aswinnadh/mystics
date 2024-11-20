import User from "../../model/user.js";


const fetchUser = async (req, res, next) => {
    const {search} = req.query; 
    const user = await User.find({
        username: { $regex: search, $options: "i" }
    })

    res.send({
        data: user
    })
}

export { fetchUser }