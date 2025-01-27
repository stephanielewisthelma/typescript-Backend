"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const Oauth_config_1 = __importDefault(require("../src/config/Oauth.config")); // Passport configuration
const router = express_1.default.Router();
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(Oauth_config_1.default.initialize());
app.use(Oauth_config_1.default.session());
// Routes
app.get('/auth/google', Oauth_config_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', Oauth_config_1.default.authenticate('google', {
    failureRedirect: '/login',
}), (req, res) => {
    res.redirect('/dashboard');
});
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(`Welcome ${req.user.firstName} ${req.user.lastName}`);
    }
    else {
        res.redirect('/login');
    }
});
// Logout Route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err)
            return res.status(500).send(err);
        res.redirect('/');
    });
});
// Attach router for other routes
app.use(router);
// Start server
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
