import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Call } from 'src/calls/calls.model';
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

    if (Roles.user === user.role) {
      can(Action.Create, Call.tableName);
      can(Action.Update, Call.tableName);
    }

    if (Roles.supervisor === user.role) {
      can(Action.Manage, Call.tableName);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
