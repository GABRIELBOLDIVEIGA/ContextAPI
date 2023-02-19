import { createContext, useContext, useEffect, useState } from "react";
import { usePagamentoContext } from 'common/context/Pagamento';
import { UsuarioContext } from 'common/context/Usuario';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState([]);
    const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
    const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);

    return (
        <CarrinhoContext.Provider 
            value={{ 
                carrinho, 
                setCarrinho, 
                quantidadeProdutos, 
                setQuantidadeProdutos,
                valorTotalCarrinho, 
                setValorTotalCarrinho
            }}
        >
            {children}
        </CarrinhoContext.Provider>);
};

export const useCarrinhoContext = () => {
    const { 
        carrinho, 
        setCarrinho, 
        quantidadeProdutos, 
        setQuantidadeProdutos,
        valorTotalCarrinho, 
        setValorTotalCarrinho 
    } = useContext(CarrinhoContext);

    const { formaPagamento } = usePagamentoContext();
    const { setSaldo } = useContext(UsuarioContext)

    function mudarQuantidade(id, quantidade) {
        return carrinho.map(itemDoCarrinho => {
            if(itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade;
            return itemDoCarrinho;
        })
    }

    function adicionarProduto(novoProduto) {
        const temOProduto = carrinho.some(itemDoCarrinho => itemDoCarrinho.id === novoProduto.id);
        
        if(!temOProduto) {
          novoProduto.quantidade = 1;
          return setCarrinho(carrinhoAnterior => [...carrinhoAnterior, novoProduto])
        }

        setCarrinho(mudarQuantidade(novoProduto.id, 1));
    }

    function removerProduto(id) {
        const produto = carrinho.find(itemDoCarrinho => itemDoCarrinho.id === id)
        const ehOUltimo = produto.quantidade === 1;

        if(ehOUltimo) {
            return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(itemDoCarrinho => itemDoCarrinho.id !== id));
        }

        setCarrinho(mudarQuantidade(id, -1));
    }

    function efetuarCompra() {
        setCarrinho([]);
        setSaldo(saldoAtua => saldoAtua - valorTotalCarrinho)
    }

    useEffect(()=> {
        const { novoTotal, novaQuantiade } = carrinho.reduce(
            (contador, produto) => ({
                novaQuantiade: contador.novaQuantiade + produto.quantidade,
                novoTotal: contador.novoTotal + (produto.quantidade * produto.valor)
            }), {
                novoTotal: 0,
                novaQuantiade: 0
            });
        
        setQuantidadeProdutos(novaQuantiade);
        setValorTotalCarrinho(novoTotal * formaPagamento.juros);
    }, [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento]);

    return {
        carrinho, 
        setCarrinho,
        adicionarProduto,
        removerProduto,
        quantidadeProdutos,
        setQuantidadeProdutos,
        valorTotalCarrinho,
        efetuarCompra
    };
}