const bcrypt = require("bcryptjs");

const User = require("../model/user.model");
const ForgotPassword = require("../model/forgot-password.model");
const generate = require("../../../helpers/generate");
const mailHelper = require("../../../helpers/mail");

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function buildSafeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    status: user.status,
  };
}

module.exports.register = async (payload) => {
  const fullName = payload.fullName?.trim();
  const email = payload.email?.trim().toLowerCase();
  const { password } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await user.save();

  return {
    code: 201,
    message: "Dang ky nguoi dung thanh cong",
    user: buildSafeUser(user),
    token: user.token,
  };
};

module.exports.login = async (payload) => {
  const email = payload.email?.trim().toLowerCase();
  const { password } = payload;

  const user = await User.findOne({
    email,
    deleted: false,
  });

  if (!user) {
    throw createHttpError(401, "Email khong ton tai");
  }

  if (user.status !== "active") {
    throw createHttpError(403, "Tai khoan da bi khoa");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createHttpError(401, "Email hoac mat khau khong dung");
  }

  return {
    code: 200,
    message: "Dang nhap thanh cong",
    token: user.token,
    user: buildSafeUser(user),
  };
};

module.exports.forgotPassword = async (payload) => {
  const email = payload.email?.trim().toLowerCase();

  const user = await User.findOne({
    email,
    deleted: false,
  });

  if (!user) {
    throw createHttpError(404, "Email khong ton tai");
  }

  const otp = generate.generateRandomNumber(6);
  const expireAt = new Date(Date.now() + 5 * 60 * 1000);

  await ForgotPassword.findOneAndUpdate(
    { email },
    { email, otp, expireAt },
    { upsert: true, new: true }
  );

  await mailHelper.sendResetPasswordOtp(email, otp);

  return {
    code: 200,
    message: "Da gui OTP ve email",
  };
};

module.exports.resetPassword = async (payload) => {
  const email = payload.email?.trim().toLowerCase();
  const { otp, password } = payload;

  const user = await User.findOne({
    email,
    deleted: false,
  });

  if (!user) {
    throw createHttpError(404, "Email khong ton tai");
  }

  const forgotPassword = await ForgotPassword.findOne({ email });

  if (!forgotPassword) {
    throw createHttpError(400, "Ban chua yeu cau OTP");
  }

  if (forgotPassword.otp !== otp) {
    throw createHttpError(400, "OTP khong chinh xac");
  }

  if (forgotPassword.expireAt.getTime() < Date.now()) {
    throw createHttpError(400, "OTP da het han");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();
  await ForgotPassword.deleteOne({ email });

  return {
    code: 200,
    message: "Dat lai mat khau thanh cong",
  };
};

module.exports.findUserByToken = async (token) => {
  if (!token) {
    return null;
  }

  return User.findOne({
    token,
    deleted: false,
    status: "active",
  }).select("-password");
};
