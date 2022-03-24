import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl.service';

@Module({
  imports: [CaslAbilityFactory],
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
