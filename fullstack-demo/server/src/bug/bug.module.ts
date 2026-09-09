import { Module } from '@nestjs/common';
import { BugController } from './bug.controller';

@Module({
  controllers: [BugController],
})
export class BugModule {}
