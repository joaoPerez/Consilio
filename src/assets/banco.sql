-- CREATE TABLE IF NOT EXISTS produtos(
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     nome TEXT, 
--     quantidade INTEGER,
--     valor REAL
-- );

CREATE TABLE IF NOT EXIST operacoes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    tipo bit,
    valor REAL,
    dataInclusao date
);
