import { LoadBundleGuard } from './load-bundle.guard';
import { BundleRegistryService } from './bundle-registry.service';

describe('LoadBundleGuard', () => {
  let guard: LoadBundleGuard;
  let serviceSpy: jasmine.Spy;
  let consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  beforeEach(() => {
    const service = new BundleRegistryService();
    guard = new LoadBundleGuard(service);
    serviceSpy = spyOn(service, 'loadBundle');
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it.each([
    [{ data: {} }],
    [{ data: { bundle: { customElementName: 'x' } } }],
    [{ data: { bundle: { bundleUrl: 'x' } } }],
  ])('should fail if the route is missing data', async (route) => {
    expect(await guard.canActivate(route as any)).toBeFalsy();
    expect(serviceSpy).toBeCalledTimes(0);
    expect(consoleErrorSpy).toBeCalledTimes(1);
  });

  it('should load a bundle and return true', async () => {
    const route = {
      data: { bundle: { customElementName: 'x', bundleUrl: 'http://localhost:4200/main.js' } },
    };
    expect(await guard.canActivate(route as any)).toBeFalsy();
    expect(serviceSpy).toBeCalledWith({
      customElementName: 'x',
      bundleUrl: 'http://localhost:4200/main.js',
    });
    expect(consoleErrorSpy).toBeCalledTimes(0);
  });
});