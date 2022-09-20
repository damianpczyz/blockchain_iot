

module.exports = (accounts) => {
    return (req, res, next) => {
try {
    const cookie = req.cookies.AccAddress;
    console.log(cookie)
    
    if (!cookie) {
        return res.status(403).json({
        status: 403,
        message: 'FORBIDDEN'
        })
    } else {
        if (cookie) {
            if (validateCookie(accounts, cookie)) next();
            else
                return res.status(401).json({
                    status: 401,
                    message: 'UNAUTHORIZED'
                })
        }
        }
} catch (error){console.error(error)}
        }
    }

  function validateCookie(accounts, cookie){
    if (accounts.indexOf(cookie) > -1)
        return true;
    else
        return false;
}