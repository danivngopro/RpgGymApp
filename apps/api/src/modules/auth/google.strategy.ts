import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "../../config.js";
import { prisma } from "../../lib/prisma.js";
import { titleForLevel } from "@rpg-gym/shared";

if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET && config.GOOGLE_CALLBACK_URL) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value.toLowerCase();
          if (!email) return done(new Error("Google account did not provide an email"));
          const usernameBase = profile.displayName?.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20) || email.split("@")[0];

          const user = await prisma.user.upsert({
            where: { email },
            update: { googleId: profile.id, avatarUrl: profile.photos?.[0]?.value },
            create: {
              email,
              googleId: profile.id,
              username: `${usernameBase}_${profile.id.slice(-5)}`,
              avatarUrl: profile.photos?.[0]?.value,
              title: titleForLevel(1)
            }
          });
          done(null, { id: user.id, email: user.email });
        } catch (error) {
          done(error);
        }
      }
    )
  );
}
