const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    passwordConfirm: {
      type: String,
      required: true,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    businessCode: {
      type: String,
      required: true,
      ref: "Business",
    }, //string based reference to the business
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    }, //direct reference to the business

    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  //only save password if it is new or modified
  if (!this.isModified("password")) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//middlleware to show password was changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//middleware to show only active users
userSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: "inactive" } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//chekc if password was changed
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  //false means not changed
  return false;
};

//create a password reset token
userSchema.methods.createResetToken = async function () {
  try {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

      console.log ({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    await this.save({ validateBeforeSave: false });
    return resetToken;
  
  } catch (error) {
    console.error("Error creating reset token", error);
    throw new Error("Error creating reset token");
  }
};

module.exports = mongoose.model("User", userSchema); // User is the name of the model, userSchema is the schema
