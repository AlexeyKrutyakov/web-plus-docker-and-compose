import { ForbiddenException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/constants';

type Obj = {
  owner: {
    id: number;
  };
};

export default function (userId: number, obj: Obj): void {
  const ownerId = obj.owner.id;
  if (ownerId !== userId) {
    throw new ForbiddenException(ERROR_MESSAGES.forbiddenToChangeObject);
  }
}
