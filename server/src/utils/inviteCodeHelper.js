import { v4 as uuidv4 } from 'uuid';

export const generateInviteCode = () => {
  const code = uuidv4().slice(0, 8).toUpperCase();
  return code;
};

export const generateExpiryTime = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

export const isCodeExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};
