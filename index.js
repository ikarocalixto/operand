


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
  const { nome, email, telefone, latitude, longitude, rua, cidade, estado } = req.body;

  try {
    const query = 'INSERT INTO clientes (nome, email, telefone, latitude, longitude, rua, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const values = [nome, email, telefone, latitude, longitude, rua, cidade, estado];
    const novoCliente = await pool.query(query, values);

    res.status(201).json(novoCliente.rows[0]);
  } catch (error) {
    console.error("Erro ao salvar cliente no banco de dados:", error);
    res.status(500).send("Erro ao salvar cliente");
  }
});

// atualizar clientes
app.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone, latitude, longitude, rua, cidade, estado } = req.body;

  try {
    const query = `
      UPDATE clientes 
      SET nome = $1, email = $2, telefone = $3, latitude = $4, longitude = $5, rua = $6, cidade = $7, estado = $8
      WHERE id = $9 
      RETURNING *`;
    const values = [nome, email, telefone, latitude, longitude, rua, cidade, estado, id];
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


// rotas GET, PUT, DELETE 
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
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


  



