import React from 'react';

const ClienteList = ({ clientes, onEdit, onDelete }) => {
  return (
    <div>
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
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.rua}</td>
              <td>
                <button onClick={() => onEdit(cliente)} className="icon-button" title="Editar">
                  <i className="bi bi-pencil-fill"></i>
                </button>
                <button onClick={() => onDelete(cliente.id)} className="icon-button" title="Deletar">
                  <i className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteList;
