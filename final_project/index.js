const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // 1. Check if the user session exists and contains an access token
    if (req.session && req.session.authorization) {
        const token = req.session.authorization['accessToken']; // Retrieve the token

        // 2. Verify the JWT token using your secret key
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                // Store user information in the request object for use in downstream routes
                req.user = user; 
                next(); // Token is valid, proceed to the next route handler
            } else {
                // Token is expired or invalid
                return res.status(403).json({ message: "User not authenticated / Invalid Token" });
            }
        });
    } else {
        // No token or session found
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
