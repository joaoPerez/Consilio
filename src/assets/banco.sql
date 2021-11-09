CREATE TABLE IF NOT EXISTS financas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT, 
    tipo TEXT,
    valor REAL,
    data_criacao TEXT,
    data_operacao TEXT
);
