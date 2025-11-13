import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { setToken } from "./services/api";
// import './assets/style.css'


//Load token only once at app start
const savedToken = localStorage.getItem("token");
if (savedToken) {
  setToken(savedToken);
}


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>,
)
