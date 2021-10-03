import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { User } from '../entity/User';

const loginUserWithUsernameAndPassword = async (username: string, password: string) => {
  try {
    const user = await User.findOne({ user_name: username });
    if (!user) {
      throw new Error(`User ${username} not found`);
    }
    const isMatchPassword = user.isValidPassword(password);

    if (!isMatchPassword) {
      throw new Error(`Password is incorrect`);
    }
    return user;
  } catch (error) {
    console.log(error.message);

    throw new ApiError(httpStatus.UNAUTHORIZED, error.message);
  }
};

export default { loginUserWithUsernameAndPassword };
