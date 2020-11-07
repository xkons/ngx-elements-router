import { Injectable } from '@angular/core';
import { BundleIdentifier } from './bundle-identifier';

function triggerLoad(url: string): void {
  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}

function waitUntilLoaded(customElementName: string): Promise<boolean> {
  return window.customElements
    .whenDefined(customElementName)
    .then(() => true)
    .catch(() => false);
}

type LoadingState = 'UNKNOWN' | 'LOADING' | 'LOADED' | 'FAILED';

@Injectable({ providedIn: 'root' })
export class BundleRegistryService {
  private loadingStates: Record<string, LoadingState> = {};

  /**
   * Loads the given bundle if not already loaded, registering its custom elements in the browser.
   */
  async loadBundle({
    bundleUrl,
    customElementName,
  }: BundleIdentifier): Promise<boolean> {
    if (this.getLoadingState(bundleUrl) !== 'UNKNOWN') {
      return true;
    }
    this.loadingStates[bundleUrl] = 'LOADING';
    triggerLoad(bundleUrl);
    const isSuccess = await waitUntilLoaded(customElementName);
    this.loadingStates[bundleUrl] = isSuccess ? 'LOADED' : 'FAILED';
    return isSuccess;
  }

  getLoadingState(bundleUrl: string): LoadingState {
    return this.loadingStates[bundleUrl] || 'UNKNOWN';
  }

  isBundleLoaded(bundleUrl: string): boolean {
    return this.getLoadingState(bundleUrl) === 'LOADED';
  }
}
