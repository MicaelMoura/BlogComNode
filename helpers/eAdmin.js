module.exports = {
    eAdmin: (req, res, next)=>{
        if(req.isAuthenticated() && req.user.eAdim == 1) {
            return next();
        }

        req.flash('error_msg', "Acesso não permitido.");
        res.redirect("/");
    }
}  