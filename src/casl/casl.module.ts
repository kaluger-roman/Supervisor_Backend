import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl.service';

@Module({
  imports: [CaslAbilityFactory],
  providers: [CaslAbilityFactory],
})
export class CaslModule {}
