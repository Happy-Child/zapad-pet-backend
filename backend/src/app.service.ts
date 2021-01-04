import { Injectable } from '@nestjs/common';
const config = require('config');

@Injectable()
export class AppService {
  getHello(): { test: string } {
    return {
      test: config.TEST,
    };
  }
}
