import { User } from '../entity/User';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { getRepository } from 'typeorm';
const createUser = async (username: string, password: string) => {
  try {
    const user = User.create({
      user_name: username,
      password: password,
    });
    await user.save();
    return user;
  } catch (error) {
    let message = 'An error occurred while creating';

    if (error.code === 'ER_DUP_ENTRY') {
      message = 'Username already exists';
    }
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
};

const getAll = async () => {
  try {
    const users = await getRepository(User).find();
    if (users.length <= 0) {
      throw new Error('List users is empty');
    }
    return users.map((user) => user.toJson());
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error.message);
  }
};

const findOneUserById = async (userId: string) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  } catch (error) {
    console.log(error);

    let code = httpStatus.BAD_REQUEST;
    let message = 'An error occurred';
    if (error.statusCode) {
      code = error.statusCode;
      message = error.message;
    }
    throw new ApiError(code, message);
  }
};

export default { createUser, getAll, findOneUserById };
