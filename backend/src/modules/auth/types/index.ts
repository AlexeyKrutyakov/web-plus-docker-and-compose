import { BaseResponse } from 'src/types/base-response';

export type SignupUserResponse = BaseResponse & {
  username: string;
  about: string;
  avatar: string;
  email: string;
};

export type SigninUserResponse = {
  access_token: string;
};
