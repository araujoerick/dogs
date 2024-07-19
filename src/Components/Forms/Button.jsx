import React from "react";
import styles from "./Button.module.css";

// Quando abre e fecha um componente, pega o valor dele com o children
// <Button>Entrar</Button> = {children}
// Como no botão podemos passar várias propriedades, distribuimos elas com
// Rest e Spread
const Button = ({ children, ...props }) => {
  return (
    <button {...props} className={styles.button}>
      {children}
    </button>
  );
};

export default Button;
