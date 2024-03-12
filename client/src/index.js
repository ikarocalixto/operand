import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Importa o componente App
import App from './App'; // Certifique-se de que o caminho para o arquivo App.js está correto

import reportWebVitals from './reportWebVitals';

// Cria a raiz do documento e renderiza o App dentro do <React.StrictMode>
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Se deseja começar a medir a performance na sua aplicação, passe uma função
// para registrar os resultados (por exemplo: reportWebVitals(console.log))
// ou envie para um endpoint de análise. Saiba mais: https://bit.ly/CRA-vitals
reportWebVitals();
