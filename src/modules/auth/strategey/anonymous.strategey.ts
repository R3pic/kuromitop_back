import { Strategy } from 'passport-anonymous';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicStrategey extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  validate() {
    return null;
  }
}