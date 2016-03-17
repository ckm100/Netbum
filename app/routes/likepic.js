module.exports = function (app, Users) {

    app.post("/likeimg", function (req, res) {

        var isLike = req.body.isLike,
            isDislike = req.body.isDisLike,
            imgId = req.body.imgId,
            imgCreator = req.body.imgCreator;

        if (isLike === 'true' && isDislike === 'true') {

            Users.findOne({
                _id: imgCreator
            }, function (err, doc) {

                doc.img.id(imgId).likes = doc.img.id(imgId).likes + 1;

                doc.img.id(imgId).dislikes = doc.img.id(imgId).dislikes - 1;

                if (doc.img.id(imgId).dislikes < 0) {

                    doc.img.id(imgId).dislikes = 0;

                }

                doc.save(function (err) {

                    if (err) {
                        return err;
                    } else {

                        Users.findOne({
                            _id: req.user._id
                        }, function (err, data) {

                            if (err) {
                                return err;
                            } else {

                                data.likePic.push(imgId);

                                data.dislikePic.splice(data.dislikePic.indexOf(imgId), 1);

                                data.save(function (err) {

                                    if (err) {
                                        return err;
                                    } else {
                                        res.end("Image like success");
                                    }

                                });
                            }

                        });

                    }

                });

            });

        } else if (isLike === 'true' && isDislike === 'false') {

            Users.findOne({
                _id: imgCreator
            }, function (err, doc) {

                doc.img.id(imgId).likes = doc.img.id(imgId).likes + 1;

                doc.save(function (err) {

                    if (err) {
                        return err;
                    } else {

                        Users.findOne({
                            _id: req.user._id
                        }, function (err, data) {

                            if (err) {
                                return err;
                            } else {

                                data.likePic.push(imgId);

                                data.save(function (err) {

                                    if (err) {
                                        return err;
                                    } else {
                                        res.end("Image like success");
                                    }

                                });
                            }

                        });

                    }

                });

            });

        } else if (isLike === 'false' && isDislike === 'false') {

            Users.findOne({
                _id: imgCreator
            }, function (err, doc) {

                doc.img.id(imgId).likes = doc.img.id(imgId).likes - 1;

                if (doc.img.id(imgId).likes < 0) {

                    doc.img.id(imgId).likes = 0;

                }

                doc.save(function (err) {

                    if (err) {
                        return err;
                    } else {

                        Users.findOne({
                            _id: req.user._id
                        }, function (err, data) {

                            if (err) {
                                return err;
                            } else {

                                data.likePic.splice(data.likePic.indexOf(imgId), 1);

                                data.save(function (err) {

                                    if (err) {
                                        return err;
                                    } else {
                                        res.end("Image like success");
                                    }

                                });
                            }

                        });

                    }

                });

            });

        }

    });

}
