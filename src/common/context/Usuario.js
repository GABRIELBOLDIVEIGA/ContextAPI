import { createContext, useState } from 'react';
import { useContext } from 'react';

export const UsuarioContext = createContext();
UsuarioContext.displayName = "Usuario";

export const UsuarioProvider = ({ children }) => {
    const [nome, setNome] = useState("");
    const [saldo, setSaldo] = useState(0);

    return (
        <UsuarioContext.Provider value={{ nome, setNome, saldo, setSaldo}}>
            {children}
        </UsuarioContext.Provider>
    )
}

// export const useUsuarioContext = () => {
//     const { saldo, setSaldo } = useContext(UsuarioContext);

//     return { saldo, setSaldo }
// }