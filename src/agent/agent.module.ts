import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AgentController } from './agent.controller';

@Module({
  imports: [UsersModule],
  controllers: [AgentController],
  providers: [],
  exports: [],
})
export class AgentModule {}
