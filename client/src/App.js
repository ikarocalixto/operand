import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';





function App() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [pesquisa, setPesquisa] = useState('');


//listar clientes
  useEffect(() => {
    fetch('http://localhost:3005/clientes')
      .then(response => response.json())
      .then(data => setClientes(data))
      .catch(error => console.error("Erro ao buscar clientes:", error));
  }, []);

//api do google = AIzaSyALzkGpxy40ZNOyuKjaEwLhtUFulmbZfFU
const obterEnderecoPeloCep = async (cep) => {
  // Remove todos os caracteres não numéricos do CEP, incluindo hífens
  const cepFormatado = cep.replace(/\D/g, '');
  if (cepFormatado.length === 8) {
    try {
      // Faz a requisição para a API do Google usando o CEP limpo
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cepFormatado},+BR&key= AIzaSyALzkGpxy40ZNOyuKjaEwLhtUFulmbZfFU`);
        if (response.data.status === 'OK') {
          const addressComponents = response.data.results[0].address_components;
          const formattedAddress = response.data.results[0].formatted_address;
          const location = response.data.results[0].geometry.location;
          const rua = addressComponents.find(component => component.types.includes("route"))?.long_name || "";
          const cidade = addressComponents.find(component => component.types.includes("administrative_area_level_2"))?.long_name || "";
          const estado = addressComponents.find(component => component.types.includes("administrative_area_level_1"))?.short_name || "";

          setRua(rua);
          setCidade(cidade);
          setEstado(estado);
          return { latitude: location.lat, longitude: location.lng };
        } else {
          console.error("Não foi possível encontrar o endereço.");
        }
      } catch (error) {
        console.error("Erro ao obter o endereço pelo CEP:", error);
      }
    }
  };

    // deletar cliente
  const deletarCliente = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/clientes/${id}`);
      setClientes(clientes.filter(cliente => cliente.id !== id)); // Atualiza a lista removendo o cliente deletado
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };


// editar cliente 
const handleEditarCliente = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(`http://localhost:3005/clientes/${clienteSelecionado.id}`, clienteSelecionado);
    // Atualiza a lista de clientes com o cliente editado
    const updatedClientes = clientes.map(cliente => {
      if (cliente.id === clienteSelecionado.id) {
        return { ...response.data };
      }
      return cliente;
    });
    setClientes(updatedClientes);
    setClienteSelecionado(null); // Reset selecionado para fechar o formulário
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteSelecionado(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  


 

  const formatarTelefone = (telefone) => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (apenasNumeros.length <= 2) {
      return `(${apenasNumeros}`;
    } else if (apenasNumeros.length <= 7) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
    } else {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
    }
  };
  
 
  
  const capitalizarNome = (nome) => {
    return nome.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
  };
  
  const adicionarCliente = async () => {
    const cepSemHifen = cep.replace('-', '');
    const nomeCapitalizado = capitalizarNome(nome);
    try {
      const response = await axios.post('http://localhost:3005/clientes', {
        nome: nomeCapitalizado, email, telefone, rua, cidade, estado, cep: cepSemHifen
      });
      if (response.status === 201) {
        setClientes([...clientes, response.data]);
        setNome('');
        setEmail('');
        setTelefone('');
        setCep('');
        setRua('');
        setCidade('');
        setEstado('');
        window.alert("Cadastro feito com sucesso!");
      } else {
        throw new Error('Falha ao adicionar cliente');
      }
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      window.alert("Erro ao adicionar cliente: " + error.message);
    }
  };
  



// Filtra os clientes pelo nome com base na entrada do usuário
const clientesFiltrados = pesquisa.length > 0
? clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(pesquisa.toLowerCase())
  )
: clientes;


 
return (
  <div className="App">
    
<center>
      <h1>Adicione Seus Clientes</h1>
      <form onSubmit={(e) => { e.preventDefault(); adicionarCliente(); }}>
    <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(capitalizarNome(e.target.value))} required />
    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
    <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(formatarTelefone(e.target.value))} required />
    <input type="text" placeholder="CEP" value={cep} onChange={(e) => { setCep(e.target.value); obterEnderecoPeloCep(e.target.value); }} required />
    <input type="text" placeholder="Rua" value={rua} onChange={(e) => setRua(e.target.value)} required />
    <input type="text" placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
    <input type="text" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} required />
    <button type="submit">Adicionar Cliente</button>
  </form>
  </center>
    

    {/* Campo de entrada para pesquisa pelo nome */}
    <input
      type="text"
      placeholder="Pesquisar cliente pelo nome..."
      value={pesquisa}
      onChange={(e) => setPesquisa(e.target.value)}
    />

<div className="App">
  {/* Outras partes do seu componente */}
  <h1>Lista de Clientes</h1>
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Email</th>
        <th>Telefone</th>
        <th>Rua</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {clientesFiltrados.map(cliente => (
        <tr key={cliente.id}>
          <td>{cliente.nome}</td>
          <td>{cliente.email}</td>
          <td>{cliente.telefone}</td>
          <td>{cliente.rua}</td>
          <td>
          <button onClick={() => setClienteSelecionado(cliente)} className="icon-button" title="Editar">
              <i className="bi bi-pencil-fill"></i>
            </button>
            <button onClick={() => deletarCliente(cliente.id)} className="icon-button" title="Deletar">
              <i className="bi bi-trash-fill"></i>
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    {clienteSelecionado && (
      <form onSubmit={handleEditarCliente}>
        <input
          type="text"
          placeholder="Nome"
          name="nome"
          value={clienteSelecionado.nome}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={clienteSelecionado.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Telefone"
          name="telefone"
          value={clienteSelecionado.telefone}
          onChange={handleChange}
          required
        />
          <input
      type="text"
      placeholder="Rua"
      name="rua"
      value={clienteSelecionado.rua}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      placeholder="Cidade"
      name="cidade"
      value={clienteSelecionado.cidade}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      placeholder="Estado"
      name="estado"
      value={clienteSelecionado.estado}
      onChange={handleChange}
      required
    />

        <button type="submit">Salvar Alterações</button>
        <button type="button" onClick={() => setClienteSelecionado(null)}>Cancelar</button>
      </form>
    )}
  </div>




  );
  
  
}


export default App;
