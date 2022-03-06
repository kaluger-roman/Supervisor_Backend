import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Record } from 'src/records/records.module';
import { Roles, User } from 'src/users/types';
import { Action, AppAbility, Subjects } from './types';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === Roles.admin) {
      can(Action.Manage, 'all');
    }

    if (user.role === Roles.supervisor) {
      can(Action.Read, Record);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
