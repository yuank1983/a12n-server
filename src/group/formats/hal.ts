import { Group, Principal } from '../../principal/types';
import { HalResource } from 'hal-types';
import { PrivilegeMap } from '../../privilege/types';

export function memberCollection(group: Group, members: Principal[]): HalResource {

  const hal: HalResource = {
    _links: {
      self: {
        href: `${group.href}/member`,
        title: group.nickname + ' members'
      },
      item: members.map( member => ({
        href: member.href,
        title: member.nickname
      })),
    },
    total: members.length,
  };

  return hal;

}

export function collection(groups: Group[]): HalResource {

  const hal: HalResource = {
    _links: {
      'self': { href: '/group' },
      'item': groups.map( group => ({
        href: group.href,
        title: group.nickname,
      })),
      'create-form': { href: '/create-user', title: 'Create New Group'},
    },
    total: groups.length,
  };

  return hal;

}

/**
 * Generate a HAL response for a specific group
 */
export function item(group: Group, privileges: PrivilegeMap, isAdmin: boolean, groups: Group[]): HalResource {

  const hal: HalResource = {
    _links: {
      'self': {href: group.href, title: group.nickname },
      'me': { href: group.identity, title: group.nickname },
      'up' : { href: '/group', title: 'List of groups' },
      'group': groups.map( group => ({
        href: group.href,
        title: group.nickname,
      })),
      'member-collection': {
        href: `${group.href}/member`,
        title: 'Group member'
      }
    },
    nickname: group.nickname,
    active: group.active,
    createdAt: group.createdAt,
    modifiedAt: group.modifiedAt,
    type: group.type,
    privileges
  };

  if (isAdmin) {
    hal._links['privileges'] = {
      href: `/user/${group.id}/edit/privileges`,
      title: 'Change privilege policy',
    };
  }

  return hal;

}
