import React from "react";

const types = {
  email: {
    regex:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: "Preencha um email válido",
  },
  password: {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
    message:
      "A senha precisa ter 1 caractere maiúsculo, 1 minúsculo e 1 dígito. Com no mínimo 8 caracteres.",
  },
};

// Recebe o tipo passado lá do LoginForm - email e etc
const useForm = (type) => {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(null);

  // Recebe o value para ser validado
  // Se for false, quer dizer que o campo tipo não foi preenchido e não
  // precisa ser validado
  function validate(value) {
    if (type === false) return true;

    if (value.length === 0) {
      setError("Preencha um valor");
      return false;
      // = types.email existe então testa o regex com .test
      // Se for falso, seta mensagem de erro
    } else if (types[type] && !types[type].regex.test(value)) {
      setError(types[type].message);
      return false;
    } else {
      setError(null);
      return true;
    }
  }

  // onChange - Função que o form utiliza para modificar seu estado
  function onChange({ target }) {
    // Toda vez que tiver onChange valida mas só quando ja tiver o primeiro erro
    // Serve para a mensagem de erro sumir ao sanar o erro
    if (error) validate(target.value);
    setValue(target.value);
  }

  return {
    value,
    setValue,
    onChange,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value),
  };
};

export default useForm;
