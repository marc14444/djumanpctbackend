// Middleware to set the language
export default (req, res, next) => {
    const language = req.cookies.language || 'en';
    req.language = language;
    next();
};  