import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendWelcomeEmail } from '../utils/emailService.js';

export const signup = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, confirmPassword } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const passwordPattern = /^[A-Za-z0-9_]{3,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 3 characters and contain only letters, numbers, and underscore'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({
      fullName,
      email,
      phoneNumber,
      password,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    });

    await user.save();
    await sendWelcomeEmail(email, fullName);

    res.status(201).json({
      message: 'User created successfully and email verified automatically.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const freshUser = await User.findById(user._id);

    res.status(200).json({
      message: 'Signin successful',
      token,
      user: {
        id: freshUser._id,
        fullName: freshUser.fullName,
        email: freshUser.email,
        phoneNumber: freshUser.phoneNumber,
        profilePicture: freshUser.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const passwordPattern = /^[A-Za-z0-9_]{3,}$/;
    if (!passwordPattern.test(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 3 characters and contain only letters, numbers, and underscore'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email })
      .select('+verificationCode +verificationCodeExpires');

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (
      user.verificationCode !== code ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.fullName);

    res.status(200).json({ message: 'Email verified successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('groups.groupId');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        phoneNumber,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};