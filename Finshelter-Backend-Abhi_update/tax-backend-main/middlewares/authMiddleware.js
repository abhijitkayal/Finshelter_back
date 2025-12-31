const jwt = require("jsonwebtoken");

// Custom error messages for different JWT errors
const JWT_ERROR_MESSAGES = {
    TokenExpiredError: "Token has expired",
    JsonWebTokenError: "Invalid token",
    NotBeforeError: "Token not active",
    default: "Authentication failed" 
};

// Utility function to handle token verification
const verifyToken = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) { 
        // Convert JWT errors to a standardized format
        const errorMessage = JWT_ERROR_MESSAGES[error.name] || JWT_ERROR_MESSAGES.default;
        throw new Error(errorMessage);
    }
};

const authMiddleware = (req, res, next) => {
    try {
        // Extract token
        const authHeader = req.header("Authorization");
        console.log('Auth Header received:', authHeader);
        
        if (!authHeader?.startsWith("Bearer ")) {
            console.log('Auth failed: Invalid or missing Bearer token');
            return res.status(401).json({
                success: false,
                message: "Access Denied. Invalid authorization header."
            });
        }

        const token = authHeader.replace("Bearer ", "");
        console.log('Token extracted:', token.substring(0, 20) + '...', 'Full length:', token.length);
        
        // Verify token
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', decoded);

        // Support both token formats (userId or _id)
        const id = decoded._id || decoded.userId;
        const role = decoded.role;

        // Validate token structure
        if (!id || !role) {
            return res.status(401).json({
                success: false, 
                message: "Access Denied. Invalid token structure."
            });
        }

        // Attach user info to request
        req.user = {
            userId: id,
            _id: id,
            role: role,
            name: decoded.name || "Unknown"
        };

        next();
    } catch (error) {
        // Only log errors that aren't related to expired tokens or malformed/invalid tokens
        // Remove console.error statement for token expiration since these are expected when sessions time out
        // This change maintains the same logic but removes the noisy console logs
        
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = authMiddleware;


// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({
//             success: false,
//             message: "Access Denied. Invalid authorization header."
//         });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.admin = decoded;
//         next();
//     } catch (err) {
//         return res.status(401).json({
//             success: false,
//             message: "Invalid or expired token"
//         });
//     }
// };
