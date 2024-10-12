import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { RouterProvider } from 'react-router-dom';
import { route } from './router/route';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={route} />
);
