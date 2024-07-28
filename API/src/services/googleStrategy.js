
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: '514051075330-fch247256mhkcstebiamet5kv1esdkeu.apps.googleusercontent.com',
    clientSecret: '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',
    // clientID: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    // passReqToCallback: true
},
    function (accessToken, refreshToken, profile, done) {
        // Validate the user profile and create session/token
        debugger
        console.log('accessToken===', accessToken);
        console.log('refreshToken===', refreshToken);
        console.log('profile===', profile);
        return done(null, profile, { profile: profile, token: accessToken });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

export default passport;