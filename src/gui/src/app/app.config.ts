import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ApiModule, BASE_PATH } from './client/src/app/core/modules/openapi';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes), 
		provideClientHydration(withEventReplay()),
		provideHttpClient(),
		ApiModule,
		{ provide: BASE_PATH, useValue: 'http://127.0.0.1:8000' }
	]
};
