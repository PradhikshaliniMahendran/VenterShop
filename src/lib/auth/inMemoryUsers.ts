// Global in-memory user registry fallback for resilient authentication
export interface InMemoryUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  customerType: 'NORMAL' | 'COMMUNITY' | 'WHOLESALE' | 'ADMIN';
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
}

declare global {
  // eslint-disable-next-line no-var
  var globalUserRegistry: Map<string, InMemoryUser> | undefined;
}

const userRegistry = global.globalUserRegistry || new Map<string, InMemoryUser>();
if (!global.globalUserRegistry) {
  global.globalUserRegistry = userRegistry;
}

export function saveInMemoryUser(user: InMemoryUser) {
  userRegistry.set(user.email.toLowerCase().trim(), user);
}

export function getInMemoryUser(email: string): InMemoryUser | undefined {
  return userRegistry.get(email.toLowerCase().trim());
}
