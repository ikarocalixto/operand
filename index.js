const express = require('express');
const cors = require('cors');
const axios = require('axios');
const pool = require('./db'); 

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());



//listar clientes
app.get('/clientes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM clientes');
    res.json(rows); // Garante que a resposta é enviada como JSON
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});


// adicionar clientes 
app.post('/clientes', async (req, res) => {
  const { nome, email, telefone, latitude, longitude } = req.body;

  try {
    const query = 'INSERT INTO clientes (nome, email, telefone, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [nome, email, telefone, latitude, longitude];
    const novoCliente = await pool.query(query, values);

    res.status(201).json(novoCliente.rows[0]);
  } catch (error) {
    console.error("Erro ao salvar cliente no banco de dados:", error);
    res.status(500).send("Erro ao salvar cliente");
  }
});

// rotas GET, PUT, DELETE 
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


 // atualizar clientes, incluindo latitude e longitude
app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, latitude, longitude } = req.body;

  try {
    const query = `
      UPDATE clientes 
      SET nome = $1, email = $2, telefone = $3, latitude = $4, longitude = $5 
      WHERE id = $6 
      RETURNING *`;
    const values = [nome, email, telefone, latitude, longitude, id];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    res.status(500).send("Erro ao atualizar cliente");
  }
});


// deletar clientes
app.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteOp = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);

    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    res.json({ message: "Cliente deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    res.status(500).send("Erro ao deletar cliente");
  }
});


  



