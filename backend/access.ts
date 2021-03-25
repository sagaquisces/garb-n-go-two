// At simplest, access control is yes or no depending on user session

import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    }
  ])
)

// check if someone meets a criteria, yes or no?
export const permissions = {
  ...generatedPermissions
}

// rule based function -- rules can return a boolean or a filter
// that limits which products they can access.

export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    if(!isSignedIn({ session })) {
      return false
    }
    // do they have permission?
    if(permissions.canManageProducts({ session })) {
      return true;
    }
    // do they own the item?
    return { user: { id: session.itemId }} // where filter
  },
  canOrder({ session }: ListAccessArgs) {
    if(!isSignedIn({ session })) {
      return false
    }
    // do they have permission?
    if(permissions.canManageCart({ session })) {
      return true;
    }
    // do they own the item?
    return { user: { id: session.itemId }} // where filter
  },
  canReadProducts({ session }: ListAccessArgs) {
    if(permissions.canManageProducts({ session })) {
      return true; // they can read all
    }
    // otherwise see only available products
    return { status: 'AVAILABLE' };
  },
  canManageOrderItems({ session }: ListAccessArgs) {
    if(!isSignedIn({ session })) {
      return false
    }
    // do they have permission?
    if(permissions.canManageCart({ session })) {
      return true;
    }
    // do they own the item?
    return { order: {user: { id: session.itemId }}} // where filter
  },
  canManageUsers({ session }: ListAccessArgs) {
    if(!isSignedIn({ session })) {
      return false
    }
    // do they have permission?
    if(permissions.canManageUsers({ session })) {
      return true;
    }
    // Otherwise you can only update yourself.
    return { id: session.itemId } // where filter
  },
}
