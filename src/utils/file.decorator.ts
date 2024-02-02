import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UploadFile = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const file = req.file;
    return file;
  },
);
