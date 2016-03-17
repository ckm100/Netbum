module.exports = function (app, passport, Users) {

    var likePic = require("./likepic")(app, Users),
        dislikePic = require("./dislike")(app, Users);

    app.get("/logout", function (req, res) {

        req.logout();

        res.redirect("/");

    });

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get("/auth/twitter/callback", function (req, res, next) {

        passport.authenticate("twitter", function (err, user, info) {

            if (err) {

                res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");
            }

            if (!user) {

                res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");

            } else {

                req.login(user, function (err) {

                    if (err) {

                        res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");

                    } else {

                        res.redirect("/myalbum");

                    }

                });
            }

        })(req, res, next);

    });

    app.get("/", function (req, res, next) {

        if (req.isAuthenticated()) {

            res.redirect("/home");

        } else {

            res.render("index");

        }

    });

    app.get("/home", function (req, res) {

        if (req.isAuthenticated()) {

            Users.find({}, function (err, doc) {

                if (err) {

                } else {

                    res.render("home", {
                        auth: true,
                        data: doc,
                        luser: req.user
                    });

                }

            });

        } else {

            Users.find({}, function (err, doc) {

                if (err) {

                } else {

                    res.render("home", {
                        auth: false,
                        data: doc
                    });
                }

            });

        }

    });

    app.get("/myalbum", function (req, res) {

        if (req.isAuthenticated()) {

            Users.findOne({

                _id: req.user._id

            }, function (err, doc) {

                if (err) {

                    return err;

                } else {

                    res.render("myalbum", {
                        data: doc,
                        luser: req.user,
                        auth: true
                    });
                }

            });

        } else {

            res.redirect("/");

        }

    });

    app.get("/settings", function (req, res) {

        if (req.isAuthenticated()) {

            res.render("settings");

        } else {

            res.redirect("/");

        }

    });

    app.post("/addimg", function (req, res) {

        var imgName = req.body.imgName,
            imgUrl = req.body.imgUrl;


        Users.findOne({
            _id: req.user._id
        }, function (err, doc) {

            doc.img.push({
                imgUrl: imgUrl,
                imgName: imgName,
                likes: 0,
                dislikes: 0
            });

            doc.save(function (err) {

                if (err) {
                    return err;
                } else {
                    res.redirect("/album");
                }

            });

        });

    });

    app.post("/deleteimg", function (req, res) {

        var imgId = req.body.imgId;

        Users.findOne({

            _id: req.user._id

        }, function (err, doc) {

            if (err) {
                return err;
            } else {

                doc.img.id(imgId).remove(function (err, rem) {

                    if (err) {
                        return err;
                    } else {

                        doc.save(function (err, sav) {

                            if (err) {
                                return err;
                            } else {
                                res.redirect("/album");
                            }

                        });
                    }

                });

            }

        });

    });


    app.get("/album", function (req, res) {

        if (req.isAuthenticated()) {

            Users.findOne({

                _id: req.user._id

            }, function (err, doc) {

                if (err) {

                    return err;

                } else {

                    res.render("album", {
                        data: doc,
                        luser: req.user,
                        auth: true
                    });
                }

            });

        } else {

            res.redirect("/");

        }

    });

    app.post("/update", function (req, res) {

        var updateName = req.body.updateName,
            updateEmail = req.body.updateEmail;

        Users.findOne({
            _id: req.user._id
        }, function (err, doc) {

            if (err) {
                return err;
            } else {

                if (updateName !== "" && updateEmail !== "") {

                    doc.uname = updateName;

                    doc.uemail = updateEmail;

                    doc.save(function (err) {

                        if (err) {
                            return err;
                        } else {
                            res.end();
                        }

                    });

                } else if (updateName !== "" && updateEmail === "") {

                    doc.uname = updateName;

                    doc.save(function (err) {

                        if (err) {
                            return err;
                        } else {
                            res.end();
                        }

                    });

                } else if (updateEmail !== "" && updateName === "") {

                    doc.uemail = updateEmail;

                    doc.save(function (err) {

                        if (err) {
                            return err;
                        } else {
                            res.end();
                        }

                    });

                }

            }

        });

    });


    app.post('/login', function (req, res, next) {

        passport.authenticate('login', function (err, user, info) {

            if (err) {

                return next(err);
            }

            if (!user) {

                var er = req.flash("message")[0];

                res.json({
                    error: er
                });

            } else {

                req.login(user, function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        res.redirect("/myalbum");

                    }

                });
            }

        })(req, res, next);

    });

    app.post('/signup', function (req, res, next) {

        passport.authenticate('signup', function (err, user, info) {

            if (err) {
                return next(err);
            }
            if (!user) {

                var er = req.flash("message")[0];

                res.json({
                    error: er
                });

            } else {

                req.login(user, function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        res.redirect("/myalbum");

                    }

                });

            }

        })(req, res, next);

    });
}
