import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TodoPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value + ' nestjs';
  }
}
