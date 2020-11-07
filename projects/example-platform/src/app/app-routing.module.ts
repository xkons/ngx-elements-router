import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoadBundleGuard } from '../../../angular-elements-router/src/lib/load-bundle.guard';

const routes: Routes = [
  {
    path: 'micro-frontend',
    canActivate: [LoadBundleGuard],
    data: {
      bundle: {
        bundleUrl: 'http://localhost:4201/main.js',
        customElementNames: ['mf-entry'],
      },
    },
    loadChildren: () =>
      import('./micro-frontend-host/micro-frontend-host.module').then(
        (m) => m.MicroFrontendHostModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
