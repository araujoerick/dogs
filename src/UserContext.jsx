// Criação de contexto global para setar status de usuário logado
// Aqui podemos criar o método para fazer login, a função de puxar o token e validar e ter um local onde salvar os dados do usuário para o app todo ter acesso

import React from "react";
import { TOKEN_POST, TOKEN_VALIDATE_POST, USER_GET } from "./api";
import { useNavigate } from "react-router-dom";

export const UserContext = React.createContext();

// UserStorage - Elemento que envolve todos os outros elementos que terão acesso ao contexto lá no App.jsx
export const UserStorage = ({ children }) => {
  const [data, setData] = React.useState(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  // Utiliza o token para pegar os dados do usuário
  async function getUser(token) {
    const { url, options } = USER_GET(token);
    const response = await fetch(url, options);
    const json = await response.json();
    setData(json);
    setIsLoggedIn(true);
  }

  // Método para logar o usuário
  // Pega e salva o token no localStorage
  async function userLogin(username, password) {
    try {
      setError(null);
      setLoading(true);
      const { url, options } = TOKEN_POST({ username, password });
      const tokenRes = await fetch(url, options);
      if (!tokenRes.ok) throw new Error("Error: Usuário ou Senha inválidos.");

      const { token } = await tokenRes.json();
      window.localStorage.setItem("token", token);
      await getUser(token);
      navigate("/conta");
    } catch (err) {
      setError(err.message);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }

  const userLogout = React.useCallback(
    async function () {
      setData(null);
      setError(null);
      setLoading(false);
      setIsLoggedIn(false);
      window.localStorage.removeItem("token");
      navigate("/login");
    },
    [navigate]
  );

  // Se ao entrar no site ja existir um token no storage, loga
  React.useEffect(() => {
    async function autoLogin() {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          setError(null);
          setLoading(true);
          const { url, options } = TOKEN_VALIDATE_POST(token);
          const response = await fetch(url, options);
          if (!response.ok) throw new Error("Token inválido");
          await getUser(token);
        } catch (err) {
          userLogout();
        } finally {
          setLoading(false);
        }
      }
    }
    autoLogin();
  }, [userLogout]);

  return (
    <UserContext.Provider
      value={{ userLogin, userLogout, data, error, loading, isLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};
