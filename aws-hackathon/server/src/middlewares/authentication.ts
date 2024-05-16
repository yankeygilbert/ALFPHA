import passport from 'passport'

export const userAuthentication = passport.authenticate('jwt', { session: false })