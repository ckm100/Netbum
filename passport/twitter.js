var TwitterStrategy = require("passport-twitter").Strategy;

module.exports = function (passport, Users) {

    passport.use(new TwitterStrategy({
            consumerKey: "D1zqxsEMUxLWdfSJDm4oAvdDs",
            consumerSecret: "RytFBwvkVfQG4AXAfcZtv80DYwfy3Y6z52KfYmMwTDhdHif9Ih",
            callbackURL: "http://netbum.heroku.com/auth/twitter/callback"
        },
        function (token, tokenSecret, profile, done) {

            Users.findOne({
                twitterId: profile.id
            }, function (err, user) {
                if (err) {

                    return done(err);

                } else {

                    if (user) {

                        done(null, user);

                    } else {

                        var user = new Users({

                            uname: profile.displayName,
                            twitterId: profile.id

                        });

                        user.save(function (err, data) {

                            if (err) {

                                return done(err)

                            } else {

                                return done(null, user);

                            }

                        });

                    }

                }

            });
        }
    ));

}
