
module.exports = (req, res, next) => {
    if (req.user.email === 'hady.elhossiny1132@gmail.com') {
        next();
    }else{
        console.log('hi')
       
        return res.redirect('/shop');
    }
    
}