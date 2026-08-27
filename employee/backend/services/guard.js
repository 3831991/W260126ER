import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    jwt.verify(req.headers.authorization || req.query.token, process.env.JWT_SECRET, (err, data) => {
        if (err) {
            res.status(401).send({ message: "User is not authorized" });
        } else {
            next();
        }
    });
}