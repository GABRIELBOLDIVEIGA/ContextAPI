import { createContext, useState, useContext } from 'react';

export const PagamentoContext = createContext();
PagamentoContext.displayName = "Pagamento";

export const PagamentoProvider = ({ children }) => {
    const tiposPagamentos =[
        {
            nome: "Boleto",
            juros: 1,
            id: 1
        },
        {
            nome: "Cartão de Credito",
            juros: 1.3,
            id: 2
        },
        {
            nome: "Bitcoin",
            juros: 0.9,
            id: 3
        },
        {
            nome: "PIX",
            juros: 1.2,
            id: 4
        }
    ];

    const [formaPagamento, setFormaPagamento] = useState(tiposPagamentos[0])

    return (
        <PagamentoContext.Provider value={{ 
            tiposPagamentos, 
            formaPagamento, 
            setFormaPagamento 
        }}>
            {children}
        </PagamentoContext.Provider>
    )
}

export const usePagamentoContext = () => {
    const { 
        tiposPagamentos, 
        formaPagamento, 
        setFormaPagamento 
    } = useContext(PagamentoContext);

    function mudarFormaPagamento(id) {
        const pagamentoAtual = tiposPagamentos.find(pagamento => pagamento.id === id);
        setFormaPagamento(pagamentoAtual);
    }

    return {
        tiposPagamentos,
        formaPagamento,
        mudarFormaPagamento
    }
}