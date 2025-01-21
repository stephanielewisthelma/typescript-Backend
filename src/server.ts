import express, { Request, Response } from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import passport from '../src/config/Oauth.config'; // Passport configuration
const router = express.Router();

dotenv.config();

const app = express();

// Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req: Request, res: Response) => {
    res.redirect('/dashboard');
  }
);

app.get('/dashboard', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome ${(req.user as any).firstName} ${(req.user as any).lastName}`);
  } else {
    res.redirect('/login');
  }
});

// Logout Route
app.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).send(err);
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
