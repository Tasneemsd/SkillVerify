const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Student = require("../models/Student");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Student.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new Student({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "GOOGLE_OAUTH", // placeholder
          });
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  Student.findById(id).then((user) => done(null, user))
);
