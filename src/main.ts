import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/config/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { firebaseConfig } from './app/config/firebase-config';
import { getDatabase } from 'firebase/database';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err)
  );



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);
export const authentication = getAuth(app);

setPersistence(authentication, browserLocalPersistence)
  .then(() => {
    console.log('Persistencia configurada como local.');
  })
  .catch((error) => {
    console.error('Error configurando persistencia:', error);
  });
// Llama a esta función al arrancar la aplicación
listenToAuthState();

function listenToAuthState() {
  onAuthStateChanged(authentication, (user) => {
    if (user) {
      console.log('Usuario autenticado:', user);
      // Aquí puedes almacenar al usuario en una variable global o servicio
    } else {
      console.log('No hay un usuario autenticado.');
    }
  });
}