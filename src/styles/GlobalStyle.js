import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: #0a192f;
    color: #e6f1ff;
    overflow-x: hidden;
    transition: background-color 0.5s ease;
    position: relative;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #0a192f;
  }

  ::-webkit-scrollbar-thumb {
    background: #64ffda;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #4cdbbd;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: clamp(2.5rem, 5vw, 4rem);
  }

  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
  }

  h3 {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
  }

  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  section {
    padding: 100px 0;
  }

  .container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .highlight {
    color: #64ffda;
  }

  .btn {
    display: inline-block;
    padding: 12px 24px;
    border: 1px solid #64ffda;
    border-radius: 4px;
    color: #64ffda;
    font-weight: 500;
    transition: all 0.3s ease;
    background-color: transparent;
  }

  .btn:hover {
    background-color: rgba(100, 255, 218, 0.1);
    transform: translateY(-3px);
  }
`;

export default GlobalStyle;