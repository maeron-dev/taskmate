import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

// Importaciones añadidas para habilitar las peticiones HTTP y el Interceptor (Reto Bonus T04)
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { versionInterceptor } from './app/interceptors/version.interceptor';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    
    // Configuración añadida para conectar Ionic con tu API REST Node.js
    provideHttpClient(
      withInterceptors([versionInterceptor]) // <-- Registra el interceptor del Reto Bonus
    )
  ],
});
  