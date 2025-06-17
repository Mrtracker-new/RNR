import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from 'styled-components';

// Define theme with proper text colors
const theme = {
  background: '#0a192f',
  cardBackground: '#112240',
  cardBackgroundHover: '#1d3557',
  primary: '#ccd6f6',
  text: '#e6f1ff',
  textLight: '#8892b0',
  accent: '#64ffda',
  buttonText: '#0a192f',
  border: '#1d3557',
  tagBackground: '#1d3557'
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
