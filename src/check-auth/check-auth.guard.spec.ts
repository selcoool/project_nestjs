import { CheckAuthGuard } from './check-auth.guard';

describe('CheckAuthGuard', () => {
  it('should be defined', () => {
    expect(new CheckAuthGuard()).toBeDefined();
  });
});
