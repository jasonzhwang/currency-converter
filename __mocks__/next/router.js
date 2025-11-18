export const useRouter = jest.fn();

export const useRouterImplementation = (overrides = {}) => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  ...overrides,
});

useRouter.mockImplementation(useRouterImplementation);
