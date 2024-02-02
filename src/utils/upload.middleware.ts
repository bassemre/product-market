import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class UploadGuardImage implements CanActivate {
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    const contentType = req.headers['content-type'];
    const isMultipart =
      contentType && contentType.includes('multipart/form-data');

    if (!isMultipart) {
      throw new BadRequestException('multipart/form-data expected.');
    }

    req.file = req.files;
    return true;
  }
}
