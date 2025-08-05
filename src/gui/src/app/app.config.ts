import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ApiModule, BASE_PATH } from './client/openapi';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes), 
		provideClientHydration(withEventReplay()),
		provideHttpClient(withFetch()),
		ApiModule,
		provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
		{ provide: BASE_PATH, useValue: 'http://127.0.0.1:8000' }
	]
};
