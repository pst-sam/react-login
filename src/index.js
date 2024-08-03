import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId='719878321739-fg302079rqtg7j8pidppd6apk5hv2f4u.apps.googleusercontent.com'>
    <React.StrictMode>
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path='/*' element={<App />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);


