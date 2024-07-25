// Criação de contexto global para setar status de usuário logado
// Aqui podemos criar o método para fazer login, a função de puxar o token e validar e ter um local onde salvar os dados do usuário para o app todo ter acesso

import React from "react";
import { TOKEN_POST, USER_GET } from "./api";

export const UserContext = React.createContext();

// UserStorage - Elemento que envolve todos os outros elementos que terão acesso ao contexto lá no App.jsx
export const UserStorage = ({ children }) => {
  const [data, setData] = React.useState(null);
  const [isLoggedIIn, setIsLoggedIn] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  // Utiliza o token para pegar os dados do usuário
  async function getUser(token) {
    const { url, options } = USER_GET(token);
    const response = await fetch(url, options);
    const json = await response.json();
    setData(json);
    setIsLoggedIn(true);
    console.log(json);
  }

  // Método para logar o usuário
  // Pega e salva o token no localStorage
  async function userLogin(username, password) {
    const { url, options } = TOKEN_POST({ username, password });
    const tokenRes = await fetch(url, options);
    const { token } = await tokenRes.json();
    window.localStorage.setItem("token", token);
    await getUser(token);
  }

  return (
    <UserContext.Provider value={{ userLogin, data }}>
      {children}
    </UserContext.Provider>
  );
};
