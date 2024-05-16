import { useState, useEffect } from 'react';
import { fetchClientes, adicionarCliente, editarCliente, deletarCliente, obterEnderecoPeloCep } from '../services/api';

const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [pesquisa, setPesquisa] = useState('');

  useEffect(() => {
    const loadClientes = async () => {
      const data = await fetchClientes();
      setClientes(data);
    };
    loadClientes();
  }, []);

  const handleAdicionarCliente = async (cliente) => {
    try {
      const novoCliente = await adicionarCliente(cliente);
      setClientes([...clientes, novoCliente]);
      window.alert("Cliente adicionado com sucesso!");
    } catch (error) {
      window.alert("Erro ao adicionar cliente: " + error.message);
    }
  };

  const handleEditarCliente = async (cliente) => {
    try {
      const clienteAtualizado = await editarCliente(cliente);
      setClientes(clientes.map(c => (c.id === cliente.id ? clienteAtualizado : c)));
      setClienteSelecionado(null);
      window.alert("Cliente editado com sucesso!");
    } catch (error) {
      window.alert("Erro ao editar cliente: " + error.message);
    }
  };

  const handleDeletarCliente = async (id) => {
    try {
      await deletarCliente(id);
      setClientes(clientes.filter(cliente => cliente.id !== id));
      window.alert("Cliente deletado com sucesso!");
    } catch (error) {
      window.alert("Erro ao deletar cliente: " + error.message);
    }
  };

  const clientesFiltrados = pesquisa.length > 0
    ? clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(pesquisa.toLowerCase())
      )
    : clientes;

  return {
    clientes,
    clienteSelecionado,
    setClienteSelecionado,
    pesquisa,
    setPesquisa,
    handleAdicionarCliente,
    handleEditarCliente,
    handleDeletarCliente,
    obterEnderecoPeloCep,
    clientesFiltrados,
  };
};

export default useClientes;
