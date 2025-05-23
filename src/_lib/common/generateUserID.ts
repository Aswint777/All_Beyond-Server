import crypto from "crypto";

export const generateUserID = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let userID = "";

  for (let i = 0; i < 20; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    userID += characters[randomIndex];
  }

  return userID;
};
