import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    // Forzar tema claro por defecto, desactivar modo oscuro accidental
    document.body.classList.remove('dark');
    document.documentElement.classList.remove('dark');

    // Configurar StatusBar para safe areas - Solución para FAB tapado
    if (this.platform.is('capacitor')) {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Light });
      } catch (error) {
        console.log('StatusBar configuration error:', error);
      }
    }
  }
}
