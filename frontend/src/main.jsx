import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './App.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
      <BrowserRouter>
        <App />
          <ToastContainer position="top-right" autoClose={2000} theme="dark" />

      </BrowserRouter>
    </Provider>
  
)
