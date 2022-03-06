import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from './types';
import { CHECK_POLICIES_KEY } from './constants';

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
