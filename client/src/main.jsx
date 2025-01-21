import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { store, persistor } from './redux/store.js'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ThemeProvider from './components/ThemeProvider.jsx'
import './index.css'

let style;
// Dynamically import the CSS file
import("./index.css").then((module) => {
  style = module.default;
});

// Cleanup

if (style) {
  const link = document.querySelector(`link[href="${style}"]`);
  if (link) document.head.removeChild(link);
}



ReactDOM.createRoot(document.getElementById('root')).render(

    <PersistGate persistor={persistor}>
   <Provider store={store}>
   <ThemeProvider>
   <App />
   </ThemeProvider>
  </Provider> 
  </PersistGate>


)
