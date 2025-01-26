import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicStrategey extends PassportStrategy(Strategy, 'public') {
    constructor() {
        super();
    }

    validate() {
        return null;
    }
}