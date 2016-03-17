var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    UserSchema;

UserSchema = new Schema({
    uname: String,
    uemail: String,
    upassword: String,
    twitterId: String,
    img: [{
        imgUrl: String,
        imgName: String,
        likes: Number,
        dislikes: Number
    }],
    likePic: [],
    dislikePic: []
});


module.exports = mongoose.model("Users", UserSchema);
