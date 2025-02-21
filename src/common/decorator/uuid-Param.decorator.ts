import { Param, ParseUUIDPipe } from '@nestjs/common';

const pipe = new ParseUUIDPipe({
  version: '4',
});

export function UUIDParam(name: string) {
  return Param(name, pipe);
}