import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';




 


function App() {
 

  
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState(''); // Definindo o estado para o endereço
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [pesquisa, setPesquisa] = useState('');

  

 // lista de clientes cadastrado
  useEffect(() => {
    fetch('http://localhost:3005/clientes')
      .then(response => response.json())
      .then(data => setClientes(data))
      .catch(error => console.error("Erro ao buscar clientes:", error));
  }, []);
  


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


  const selecionarClienteParaEdicao = (cliente) => {
    const clienteEditavel = {
      ...cliente,
      nome: cliente.nome || "",
      email: cliente.email || "",
      telefone: cliente.telefone || "",
      latitude: cliente.latitude || 0, // Considerando 0 como valor padrão para exemplo
      longitude: cliente.longitude || 0, // Considerando 0 como valor padrão para exemplo
    };
    setClienteSelecionado(clienteEditavel);
  };
  

// Api google para calcular coodenadas
  const obterCoordenadas = async (endereco) => {
    const apiKey = 'AIzaSyALzkGpxy40ZNOyuKjaEwLhtUFulmbZfFU';
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(endereco)}&key=${apiKey}`);
      if (response.data.status !== 'OK' || !response.data.results[0]) {
        console.error("A resposta da API não foi OK ou não contém resultados.");
        return null;
      }
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      console.error("Erro ao obter coordenadas:", error);
      return null;
    }
  };
  

  async function buscarEnderecoPorCoordenadas(lat, lng) {
  const apiKey = 'SUA_CHAVE_DA_API_AQUI';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      // O endereço completo geralmente está no primeiro resultado
      const enderecoCompleto = data.results[0].formatted_address;
      return enderecoCompleto;
    } else {
      console.error('Não foi possível encontrar o endereço.', data.status);
    }
  } catch (error) {
    console.error('Erro ao buscar endereço:', error);
  }
}

  
// funçao para adicinoar clientes 
  const adicionarCliente = async () => {
    const coordenadas = await obterCoordenadas(endereco);
    if (coordenadas) {
      fetch('http://localhost:3005/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          latitude: coordenadas.lat,
          longitude: coordenadas.lng
        }),
      })
      .then(response => response.json())
      .then(data => {
        setClientes(prevClientes => [...prevClientes, data]);
        // Limpar os campos do formulário após o envio
        setNome('');
        setEmail('');
        setTelefone('');
        setEndereco('');
      })
      .catch((error) => {
        console.error('Erro:', error);
      });
    }
  };
 

  
const calcularDistancia = (lat, lng) => {
  return Math.sqrt(lat * lat + lng * lng);
};

// Função para ordenar clientes por proximidade a (0,0)
const ordenarClientesPorProximidade = () => {
  const clientesOrdenados = [...clientes].sort((a, b) => {
    const distA = calcularDistancia(a.latitude, a.longitude);
    const distB = calcularDistancia(b.latitude, b.longitude);
    return distA - distB;
  });
  setClientes(clientesOrdenados);
};

// Filtra os clientes pelo nome com base na entrada do usuário
const clientesFiltrados = pesquisa.length > 0
? clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(pesquisa.toLowerCase())
  )
: clientes;


 
return (
  <div className="App">
    <div className='calcular_rota'>
      <button onClick={ordenarClientesPorProximidade}>Calcular Rota</button>
    </div>

    <h1> Adicione Seus Clientes</h1>
    <form onSubmit={(e) => e.preventDefault() || adicionarCliente()}>
      <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
      <input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
      <button type="submit">Adicionar Cliente</button>
    </form>

    {/* Campo de entrada para pesquisa pelo nome */}
    <input
      type="text"
      placeholder="Pesquisar cliente pelo nome..."
      value={pesquisa}
      onChange={(e) => setPesquisa(e.target.value)}
    />

    <ul>
      {clientesFiltrados.map(cliente => (
        <li key={cliente.id}>
          {cliente.nome} - {cliente.email} - {cliente.telefone} - {cliente.latitude}, {cliente.longitude}
          <button onClick={() => setClienteSelecionado(cliente)}>Editar</button>
          <button onClick={() => deletarCliente(cliente.id)}>Deletar</button>
        </li>
      ))}
    </ul>
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
          type="number"
          step="0.000001"
          placeholder="Latitude"
          name="latitude"
          value={clienteSelecionado.latitude}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          step="0.000001"
          placeholder="Longitude"
          name="longitude"
          value={clienteSelecionado.longitude}
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
