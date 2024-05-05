// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

const defaultRoles = ['user', 'admin'];

export const Roles = (...roles: string[]) =>
  SetMetadata(
    'roles',
    roles.length > 0 ? roles.map((role) => role.toLowerCase()) : defaultRoles,
  );
