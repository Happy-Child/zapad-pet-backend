import { Module } from '@nestjs/common';
import { PugEngineService } from './pug-engine.service';

@Module({
  providers: [PugEngineService],
  exports: [PugEngineService],
})
export class PugEngineModule {}
