import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  console.log('Headers:', req.headers);
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Extracted token:', token);
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT Verification Error:', err);
      return res.status(403).json({ message: 'Forbidden', error: err.message });
    }
    console.log('Decoded user:', user);
    req.user = user;
    console.log('Req.user:', req.user);
    next();
  });
};

export default authenticateUser ;