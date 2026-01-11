# Configuración de Firebase para Norwest DS

## Pasos para configurar Firebase:

### 1. Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Add project" / "Agregar proyecto"
3. Nombre: `norwest-ds` (o el que prefieras)
4. Deshabilita Google Analytics (opcional)

### 2. Habilitar Authentication
1. En el menú lateral, ve a **Build > Authentication**
2. Clic en "Get started"
3. En la pestaña **Sign-in method**, habilita:
   - ✅ **Email/Password**

### 3. Crear base de datos Firestore
1. En el menú lateral, ve a **Build > Firestore Database**
2. Clic en "Create database"
3. Modo: **Start in test mode** (por ahora, configuraremos reglas después)
4. Ubicación: `us-central` o la más cercana

### 4. Obtener credenciales del proyecto
1. Ve a **Project Settings** (⚙️ en el menú lateral)
2. En la sección "Your apps", selecciona la opción **Web** (</>)
3. Registra tu app: nombre = "Norwest DS Web"
4. Copia el objeto `firebaseConfig` que aparece

### 5. Configurar en tu proyecto
Abre el archivo `src/firebase/config.js` y reemplaza las credenciales:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
\`\`\`

### 6. Configurar reglas de seguridad de Firestore
En **Firestore Database > Rules**, pega estas reglas:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regla para colección de usuarios
    match /users/{userId} {
      // Los usuarios solo pueden leer/escribir su propio documento
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Los admins pueden leer todos los usuarios
      allow read: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Otras colecciones (proyectos, documentos, etc.)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

### 7. Crear primer usuario administrador
Después de configurar Firebase, puedes:
1. Ir a `/register` en tu app
2. Crear una cuenta
3. En Firebase Console > Firestore Database
4. Busca tu usuario en la colección `users`
5. Cambia el campo `role` de `client` a `admin`

## Estructura de datos en Firestore

### Collection: users
\`\`\`
users/{userId}
  - email: string
  - displayName: string
  - role: 'admin' | 'pm' | 'client'
  - createdAt: timestamp
  - active: boolean
\`\`\`

### Collection: projects (crear después)
\`\`\`
projects/{projectId}
  - title: string
  - description: string
  - clientId: string (ref a users)
  - pmId: string (ref a users)
  - status: 'active' | 'completed' | 'pending'
  - createdAt: timestamp
\`\`\`

## Próximos pasos
- Probar login/registro en `/login` y `/register`
- Crear primer admin manualmente en Firestore
- Acceder a `/dashboard` después de login
