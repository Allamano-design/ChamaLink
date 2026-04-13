import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendReminderEmail = async (email, groupName, amount) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: Contribution Due for ${groupName}`,
      html: `
        <h2>Contribution Reminder</h2>
        <p>Dear Member,</p>
        <p>This is a reminder that your monthly contribution of <strong>${amount}</strong> is due for <strong>${groupName}</strong>.</p>
        <p>Please make your payment at your earliest convenience.</p>
        <p>Thank you,<br/>ChamaLink Team</p>
      `,
    });
  } catch (error) {
    console.log('Email error:', error.message);
  }
};

export const sendWelcomeEmail = async (email, fullName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to ChamaLink!',
      html: `
        <h2>Welcome to ChamaLink!</h2>
        <p>Dear ${fullName},</p>
        <p>Welcome to ChamaLink - Your Group Savings Management Platform!</p>
        <p>You can now create or join savings groups and manage your finances together.</p>
        <p>Happy saving!<br/>ChamaLink Team</p>
      `,
    });
  } catch (error) {
    console.log('Email error:', error.message);
  }
};

export const sendVerificationEmail = async (email, fullName, code) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your ChamaLink Email Address',
      html: `
        <h2>Email Verification</h2>
        <p>Dear ${fullName},</p>
        <p>Thank you for signing up for ChamaLink.</p>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>ChamaLink Team</p>
      `,
    });
  } catch (error) {
    console.log('Email error:', error.message);
  }
};

export default transporter;
