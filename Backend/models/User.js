// import mongoose from "mongoose";
// import passportLocalMongoose from "passport-local-mongoose";

// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
// });

// userSchema.plugin(passportLocalMongoose);// to automatically hash and store the password safely

// const User = mongoose.model("User", userSchema);

// export default User;

import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

export default User;