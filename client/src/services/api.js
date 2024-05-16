import axios from 'axios';

const API_URL = 'http://localhost:3005/clientes';
const GOOGLE_API_KEY = 'AIzaSyALzkGpxy40ZNOyuKjaEwLhtUFulmbZfFU';

export const fetchClientes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const adicionarCliente = async (cliente) => {
  const response = await axios.post(API_URL, cliente);
  return response.data;
};

export const editarCliente = async (cliente) => {
  const response = await axios.put(`${API_URL}/${cliente.id}`, cliente);
  return response.data;
};

export const deletarCliente = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export const obterEnderecoPeloCep = async (cep) => {
  const cepFormatado = cep.replace(/\D/g, '');
  if (cepFormatado.length === 8) {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${cepFormatado},+BR&key=${GOOGLE_API_KEY}`);
      if (response.data.status === 'OK') {
        const addressComponents = response.data.results[0].address_components;
        const rua = addressComponents.find(component => component.types.includes("route"))?.long_name || "";
        const cidade = addressComponents.find(component => component.types.includes("administrative_area_level_2"))?.long_name || "";
        const estado = addressComponents.find(component => component.types.includes("administrative_area_level_1"))?.short_name || "";
        return { rua, cidade, estado };
      }
    } catch (error) {
      console.error("Erro ao obter o endereço pelo CEP:", error);
    }
  }
}; 
