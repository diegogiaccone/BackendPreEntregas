import passport from "passport";
import GithubStrategy from 'passport-github2';
import userModel from '../users/user.model.js';
import {} from 'dotenv/config'

const initializePassport = () => {
    // Estrategia Github
    const githubData = {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackUrl: 'http://localhost:3030/githubcallback'
    };

    const verifyAuthGithub = async (accessToken, refreshToken, profile, done) => {        
        done(null, profile)
    }

    passport.use('github', new GithubStrategy(githubData, verifyAuthGithub));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err.message);
        }
    });
}

export default initializePassport;