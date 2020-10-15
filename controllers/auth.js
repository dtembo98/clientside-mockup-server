

exports.getLogin = (req,res,next) =>
{
    res.status(200).json({
    status: "success"
    })
}

exports.postLogin = (req,res,next) =>
{
    const data = req.body;
    return res.status(200).json({
    status:"success",
    data
    })
}