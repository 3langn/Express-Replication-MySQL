import moment, { Moment } from 'moment';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { User } from '../entity/User';
import ApiError from '../utils/ApiError';
import { Token } from '../entity/Token';
import TokenTypes from '../config/tokens';
import config from '../config/config';
const generateToken = (userId: number, expires: Moment, type: TokenTypes, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};
const saveToken = async (token: string, user: User, expires: Moment, type: TokenTypes) => {
  const tokenDoc = Token.create({ token, user, expires: expires.toDate(), type });
  await tokenDoc.save();
  return tokenDoc;
};

const verifyToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, config.jwt.secret);
    return payload;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, error.message);
  }
};

const generateAuthToken = async (user: User) => {
  try {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user.id, accessTokenExpires, TokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user.id, refreshTokenExpires, TokenTypes.REFRESH);
    await saveToken(refreshToken, user, refreshTokenExpires, TokenTypes.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires,
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires,
      },
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export default {
  generateToken,
  generateAuthToken,
  verifyToken,
};
