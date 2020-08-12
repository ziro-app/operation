import React from 'react'
import { unstable_createRoot } from 'react-dom'
import { FirebaseAppProvider } from 'reactfire'
import { load as FontLoader } from 'webfontloader'
import { configFirebase } from './Firebase/index'
import App from './App/index'
import './index.css'

FontLoader({
  google: { families: ['Rubik:500,600', 'Work Sans:300,400,500'] },
})

unstable_createRoot(document.getElementById('app')).render(
  <FirebaseAppProvider firebaseConfig={configFirebase}>
    <App />
  </FirebaseAppProvider>,
)
