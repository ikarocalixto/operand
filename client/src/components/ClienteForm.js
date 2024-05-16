import React, { useState, useEffect } from 'react';

const ClienteForm = ({ onSave, clienteToEdit, obterEnderecoPeloCep }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cep: '',
    rua: '',
    cidade: '',
    estado: ''
  });

  useEffect(() => {
    if (clienteToEdit) {
      setFormData(clienteToEdit);
    }
  }, [clienteToEdit]);

  const formatCep = (cep) => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length <= 5) {
      return cleanedCep;
    }
    return `${cleanedCep.slice(0, 5)}-${cleanedCep.slice(5, 8)}`;
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cep') {
      formattedValue = formatCep(value);
    } else if (name === 'telefone') {
      formattedValue = formatarTelefone(value);
    } else if (name === 'nome') {
      formattedValue = capitalizarNome(value);
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: formattedValue
    }));

    if (name === 'cep' && formattedValue.replace(/\D/g, '').length === 8) {
      const endereco = await obterEnderecoPeloCep(formattedValue);
      if (endereco) {
        setFormData(prevState => ({
          ...prevState,
          rua: endereco.rua,
          cidade: endereco.cidade,
          estado: endereco.estado
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cep: '',
      rua: '',
      cidade: '',
      estado: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} required />
      <input type="text" name="cep" placeholder="CEP" value={formData.cep} onChange={handleChange} required />
      <input type="text" name="rua" placeholder="Rua" value={formData.rua} onChange={handleChange} required />
      <input type="text" name="cidade" placeholder="Cidade" value={formData.cidade} onChange={handleChange} required />
      <input type="text" name="estado" placeholder="Estado" value={formData.estado} onChange={handleChange} required />
      <button type="submit">Salvar</button>
      {clienteToEdit && <button type="button" onClick={resetForm}>Cancelar</button>}
    </form>
  );
};

export default ClienteForm;
