import { BaseResponse } from 'src/types/base-response';

export type UserPublicProfileResponse = BaseResponse & {
  username: string;
  about: string;
  avatar: string;
};

export type UserProfileResponse = UserPublicProfileResponse & {
  email: string;
};
