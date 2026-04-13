import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },

    phoneNumber: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    verificationCode: {
      type: String,
      select: false,
    },

    verificationCodeExpires: {
      type: Date,
      select: false,
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 3,
      match: [
        /^[A-Za-z0-9_]{3,}$/,
        'Password must be at least 3 characters and contain only letters, numbers, and underscore'
      ],
      select: false,
    },

    profilePicture: {
      type: String,
      default: null,
    },

    groups: [
      {
        groupId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Group',
        },

        role: {
          type: String,
          enum: ['admin', 'member'],
          default: 'member',
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    totalSavings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);