const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    isEmailVerified: { type: Boolean, default: false }, // Add this field
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "sales"],
      required: true,
    },
    studentDetails: {
      isStudentVerified: {
        type: Boolean,
        default: false,
      },
      collegeId: {
        type: String,
        required: function () {
          return this.role === "student"; // Enforces `collegeId` only for students
        },
        unique: true,
        sparse: true, // Ensures uniqueness for defined values
      },
      collegeName: {
        type: String,
        trim: true,
      },
      graduationDate: {
        month: {
          type: String,
          enum: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          required: false, // Optional if not applicable
        },
        year: {
          type: Number,
          min: 1900, // Minimum plausible year
          max: 2100, // Future-proofing for the next 80+ years
        },
      },
      collegeAdmissionLetterURL: {
        type: String,
      },
      homeAddress: {
        type: String,
        trim: true,
      },
      degreeType: {
        type: String,
        enum: ["bachelors", "masters", "ph.D"],
      },
      alreadyEnrolledPlan: {
        isEnrolled: {
          type: Boolean,
          default: false,
        },
        details: {
          insuranceCompany: String,
          duration: Number,
          hasPreviousClaim: Boolean,
          previousClaimDetails: String,
        },
      },
      purchasedPlans: [
        {
          planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Plan",
          },
          purchaseDate: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is not modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre("remove", async function (next) {
  console.log("Delete is triggered");
  try {
    // Check if the user is a sales user and then mark their plans as discontinued
    if (this.role === "sales") {
      await Plan.updateMany({ createdBy: this._id }, { discontinued: true });
    }
    next(); // Proceed with the deletion
  } catch (error) {
    next(error); // Pass error to the next middleware or error handler
  }
});

// Method to compare passwords for authentication
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Compile the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
