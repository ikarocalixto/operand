import React from 'react';
import ClienteForm from './components/ClienteForm';
import ClienteList from './components/ClienteList';
import useClientes from './hooks/useClientes';
import './App.css';

const App = () => {
  const {
    clientes,
    clienteSelecionado,
    setClienteSelecionado,
    pesquisa,
    setPesquisa,
    handleAdicionarCliente,
    handleEditarCliente,
    handleDeletarCliente,
    obterEnderecoPeloCep,
    clientesFiltrados
  } = useClientes();

  const handleSave = async (cliente) => {
    if (clienteSelecionado) {
      await handleEditarCliente({ ...clienteSelecionado, ...cliente });
    } else {
      await handleAdicionarCliente(cliente);
    }
  };

  return (
    <div className="App">
      <center>
        <h1>Adicione Seus Clientes</h1>
        <ClienteForm onSave={handleSave} clienteToEdit={clienteSelecionado} obterEnderecoPeloCep={obterEnderecoPeloCep} />
      </center>

      <input
        type="text"
        placeholder="Pesquisar cliente pelo nome..."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      <ClienteList clientes={clientesFiltrados} onEdit={setClienteSelecionado} onDelete={handleDeletarCliente} />

      {clienteSelecionado && (
        <form onSubmit={handleEditarCliente}>
          <input
            type="text"
            placeholder="Nome"
            name="nome"
            value={clienteSelecionado.nome}
            onChange={(e) => setClienteSelecionado({ ...clienteSelecionado, nome: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={clienteSelecionado.email}
            onChange={(e) => setClienteSelecionado({ ...clienteSelecionado, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Telefone"
            name="telefone"
            value={clienteSelecionado.telefone}
            onChange={(e) => setClienteSelecionado({ ...clienteSelecionado, telefone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Rua"
            name="rua"
            value={clienteSelecionado.rua}
            onChange={(e) => setClienteSelecionado({ ...clienteSelecionado, rua: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Cidade"
            name="cidade"
            value={clienteSelecionado.cidade}
            onChange={(e) => setClienteSelecionado({ ...clienteSelecionado, cidade: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Estado"
            name="estado"
            value={clienteSelecionado.estado}
            onChange={(e) => setClienteSelecionado({ ...clienteSelecionado, estado: e.target.value })}
            required
          />
          <button type="submit">Salvar Alterações</button>
          <button type="button" onClick={() => setClienteSelecionado(null)}>Cancelar</button>
        </form>
      )}
    </div>
  );
};

export default App;
