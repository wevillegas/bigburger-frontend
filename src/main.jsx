import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import "antd/dist/antd.css";
import "./index.css";
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// la sesión es una cookie HttpOnly: el navegador debe mandarla en los requests a la API (otro origen)
axios.defaults.withCredentials = true;


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);


