import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

import { AuthFailureResponse, BadRequestResponse, InternalErrorResponse, NotFoundResponse, SuccessResponse } from '../utils/ApiResponse.js';

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export async function signup(req, res) {
  try {
    const { name, email, password, address } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      address,
      role: 'USER'
    });

    // const token = signToken(user);

    const data = {
      // token,
      user: user.toJSON()
    };

    return new SuccessResponse("Account created successfully", data).send(res);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return new BadRequestResponse(error.message).send(res);
    }

    if (error.code === 11000) {
      return new BadRequestResponse("Email already registered").send(res);
    }

    return new InternalErrorResponse(error.message).send(res);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return new AuthFailureResponse("Invalid credentials").send(res);
    }
    const token = signToken(user);
    const data = { token, user: user.toJSON() };
    new SuccessResponse("Logged in successfully", data).send(res);
  } catch (error) {
    new InternalErrorResponse("Server error").send(res);
  }
}

export async function logout(req, res) {
  res.json({ message: 'Logged out successfully' });
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }
    user.password = newPassword;
    await user.save();
    const token = signToken(user);
    res.json({ message: 'Password updated', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}