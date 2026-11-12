import { createRoot } from 'react-dom/client'
import "@fontsource/be-vietnam-pro"; // Defaults to weight 700
import "@fontsource/be-vietnam-pro/700.css"; // Specify weight
import "@fontsource/be-vietnam-pro/700-italic.css"; // Specify weight and style
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,

  onOfflineReady() {
    console.log('Application is ready to work offline!')
  },

  onRegisteredSW(swUrl, registration) {
    console.log('Service Worker registered:', swUrl)
  },

  onRegisterError(error) {
    console.error('Service Worker registration failed:', error)
  }
})

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
