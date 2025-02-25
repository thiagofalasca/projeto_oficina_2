import { vi } from 'vitest';

const NAMock = {
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  handlers: {
    GET: vi.fn(),
    POST: vi.fn(),
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NAMock;
