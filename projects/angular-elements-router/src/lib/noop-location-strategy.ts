import { APP_BASE_HREF, LocationChangeListener, LocationStrategy, PlatformLocation } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';

/**
 * Acts as a noop location strategy that does not modify the browser url.
 * Should be used for a RouterModule in a micro frontend such that the RouterModule of the platform is in charge of modifying the browser url.
 *
 * ```
 * imports: [
 *   RouterModule.forRoot([
 *     { path: 'root', children: [{ path: '**', component: NoComponent }] },
 *     { path: 'other-route', component: SomeComponent }
 *   ])
 * ],
 * providers: [
 *   { provide: LocationStrategy, useClass: NoopLocationStrategy },
 * ]
 * ```
 */
@Injectable()
export class NoopLocationStrategy extends LocationStrategy {
  private readonly baseHref: string;

  constructor(private platformLocation: PlatformLocation, @Optional() @Inject(APP_BASE_HREF) baseHref?: string) {
    super();
    this.baseHref = baseHref || this.platformLocation.getBaseHrefFromDOM();
    if (!this.baseHref) {
      throw new Error(`No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.`);
    }
  }

  onPopState(_fn: LocationChangeListener): void {}

  getBaseHref(): string {
    return this.baseHref;
  }

  path(_includeHash: boolean = false): string {
    return '';
  }

  prepareExternalUrl(internal: string): string {
    return internal;
  }

  pushState(_state: any, _title: string, _path: string, _queryParams: string) {}

  replaceState(_state: any, _title: string, _path: string, _queryParams: string) {}

  forward(): void {}

  back(): void {}
}