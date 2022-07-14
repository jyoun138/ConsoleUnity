//GET /about: send html form for about page

exports.about = (req, res)=> {
    res.render('./about');
};

//GET /contacts: send html form for contacts page

exports.contact = (req, res)=> {
    res.render('./contact');
};

//GET /: send html form for home page

exports.home = (req, res)=> {
    res.render('./');
};

