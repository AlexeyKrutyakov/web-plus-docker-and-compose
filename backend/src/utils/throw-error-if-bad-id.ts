import { BadRequestException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';

export default function (value: any): void {
  const id = +value;
  if (isNaN(id)) {
    throw new BadRequestException(ERROR_MESSAGES.badId);
  }
}
