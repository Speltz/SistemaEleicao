const express = require('express');
const router = express.Router();

module.exports = (connection) => {
    // Rotas
    router.get('/', (req, res) => {
        res.render('index', { title: 'Home Page' });
    });

    // Operações FUNÇÕES
    // Index
    router.get('/funcao', (req, res) => {
        connection.query('SELECT * FROM tbFuncao', (err, results) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.render('funcao/index', { title: 'Funções', funcao: results });
            }
        });
    });

    // Página CREATE
    router.get('/funcao/create', (req, res) => {
        res.render('funcao/create', { title: 'Cadastrar Função' });
    });

    // Create FUNÇÃO
    router.post('/funcao/create', (req, res) => {
        const { nmFuncao, dsFuncao, tpContrato } = req.body;
        const query = 'INSERT INTO tbFuncao (nmFuncao, dsFuncao, tpContrato) VALUES (?, ?, ?)';
        connection.query(query, [nmFuncao, dsFuncao, tpContrato], (err, result) => {
            if (err) {
                res.status(500).json({ message: err.message, type: 'danger' });
            } else {
                req.session.message = {
                    type: 'success',
                    message: 'Função cadastrada com sucesso!'
                };
                res.redirect('/funcao');
            }
        });
    });

    // Página EDIT
    router.get('/funcao/edit/:idFuncao', (req, res) => {
        const idFuncao = req.params.idFuncao;
        const query = 'SELECT * FROM tbFuncao WHERE idFuncao = ?';

        connection.query(query, [idFuncao], (err, results) => {
            if (err) {
                res.redirect('/');
            } else {
                if (results.length > 0) {
                    res.render('funcao/edit', {
                        title: 'Editar Função',
                        funcao: results[0]
                    });
                } else {
                    res.redirect('/');
                }
            }
        });
    });

    //EDIT Função
    router.post('/funcao/edit/:idFuncao', (req, res) => {
        const { idFuncao } = req.params;
        const { nmFuncao, dsFuncao, tpContrato } = req.body;

        const query = `UPDATE tbFuncao SET nmFuncao = ?, dsFuncao = ?, tpContrato = ? 
        WHERE idFuncao = ?`;
        connection.query(query, [nmFuncao, dsFuncao, tpContrato, idFuncao], (err, result) => {
            if (err) {
                console.error(err);
                req.session.message = {
                    type: 'danger',
                    message: 'Erro ao atualizar a função.'
                };
                res.redirect('/funcao');
            } else {
                if (result.affectedRows === 0) {
                    req.session.message = {
                        type: 'warning',
                        message: 'Função não encontrada.'
                    };
                } else {
                    req.session.message = {
                        type: 'success',
                        message: 'Função atualizada com sucesso!'
                    };
                }
                res.redirect('/funcao');
            }
        });
    });

    // Delete FUNÇÃO
    router.get('/funcao/delete/:idFuncao', (req, res) => {
        let idFuncao = req.params.idFuncao;
        const query = 'DELETE FROM tbFuncao WHERE idFuncao = ?';

        connection.query(query, [idFuncao], (err, result) => {
            if (err) {
                console.error(err);
                res.json({ message: err.message });
            } else {
                if (result.affectedRows === 0) {
                    req.session.message = {
                        type: 'warning',
                        message: 'Função não encontrada.'
                    };
                } else {
                    req.session.message = {
                        type: 'info',
                        message: 'Função deletada com sucesso!'
                    };
                }
                res.redirect('/funcao');
            }
        });
    });
    //-----------------------------------------------------------------------------------------------------

    // Operações CANDIDATO
    // Index
    router.get('/candidato', (req, res) => {
        connection.query('SELECT * FROM tbCandidato', (err, results) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.render('candidato/index', { title: 'Candidatos', candidato: results });
            }
        });
    });

    // Página CREATE
    router.get('/candidato/create', (req, res) => {
        res.render('candidato/create', { title: 'Cadastrar Candidato' });
    });

    // Create CANDIDATO
    router.post('/candidato/create', (req, res) => {
        const { nrCandidato, partido, cargo, municipio, nmCandidato, cnpj,
            enderecoCandidato, cidadeCandidato, cepCandidato, cpfAdmFinanceiro, rgAdmFinanceiro,
            ecAdmFinanceiro, profAdmFinanceiro, nmAdmFinanceiro, enderecoAdmFinanceiro, cidadeAdmFinanceiro,
            cepAdmFinanceiro, dtInicioCampanha, dtFimCampanha,dtTrava, lmMilitantes, lmVeiculos } = req.body;

        //Remove caracteres não numéricos
         const cleanCnpj = cnpj.replace(/\D/g, '');
         const cleanCepCandidato = cepCandidato.replace(/\D/g, '');
         const cleanCpfAdmFinanceiro = cpfAdmFinanceiro.replace(/\D/g, '');
         const cleanCepAdmFinanceiro = cepAdmFinanceiro.replace(/\D/g, '');

        const query = `INSERT INTO tbCandidato (nrCandidato, partido, cargo, municipio, nmCandidato, cnpj,
                        enderecoCandidato, cidadeCandidato, cepCandidato, cpfAdmFinanceiro, rgAdmFinanceiro, 
                        ecAdmFinanceiro, profAdmFinanceiro, nmAdmFinanceiro, enderecoAdmFinanceiro, cidadeAdmFinanceiro, 
                        cepAdmFinanceiro, dtInicioCampanha, dtFimCampanha, dtTrava, lmMilitantes, lmVeiculos ) VALUES (?, ?, ?, ?, ?, ?, 
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        connection.query(query, [nrCandidato, partido, cargo, municipio, nmCandidato, cleanCnpj,
            enderecoCandidato, cidadeCandidato, cleanCepCandidato, cleanCpfAdmFinanceiro, rgAdmFinanceiro,
            ecAdmFinanceiro, profAdmFinanceiro, nmAdmFinanceiro, enderecoAdmFinanceiro, cidadeAdmFinanceiro,
            cleanCepAdmFinanceiro, dtInicioCampanha, dtFimCampanha, dtTrava, lmMilitantes, lmVeiculos], (err, result) => {
                if (err) {
                    res.status(500).json({ message: err.message, type: 'danger' });
                } else {
                    req.session.message = {
                        type: 'success',
                        message: 'Candidato cadastrado com sucesso!'
                    };
                    res.redirect('/candidato');
                }
            });
    });

    //View CANDIDATO
    router.get('/candidato/view/:nrCandidato', (req, res) => {
        const nrCandidato = req.params.nrCandidato;
        const query = 'SELECT * FROM tbCandidato WHERE nrCandidato = ?';

        connection.query(query, [nrCandidato], (err, results) => {
            if (err) {
                res.redirect('/');
            } else {
                if (results.length > 0) {
                    res.render('candidato/view', {
                        title: 'Detalhes do candidato',
                        candidato: results[0]
                    });
                } else {
                    res.redirect('/');
                }
            }
        });
    });

    // Página EDIT
    router.get('/candidato/edit/:nrCandidato', (req, res) => {
        const nrCandidato = req.params.nrCandidato;
        const query = 'SELECT * FROM tbCandidato WHERE nrCandidato = ?';

        connection.query(query, [nrCandidato], (err, results) => {
            if (err) {
                res.redirect('/');
            } else {
                if (results.length > 0) {
                    res.render('candidato/edit', {
                        title: 'Editar Candidato',
                        candidato: results[0]
                    });
                } else {
                    res.redirect('/');
                }
            }
        });
    });

    //EDIT Candidato
    router.post('/candidato/edit/:nrCandidato', (req, res) => {

        const originalNrCandidato = req.params.nrCandidato;
        const { nrCandidato, partido, cargo, municipio, nmCandidato, cnpj,
            enderecoCandidato, cidadeCandidato, cepCandidato, cpfAdmFinanceiro, rgAdmFinanceiro,
            ecAdmFinanceiro, profAdmFinanceiro, nmAdmFinanceiro, enderecoAdmFinanceiro, cidadeAdmFinanceiro,
            cepAdmFinanceiro, dtInicioCampanha, dtFimCampanha, dtTrava, lmMilitantes, lmVeiculos } = req.body;

        //Remove caracteres não numéricos
         const cleanCnpj = cnpj.replace(/\D/g, '');
         const cleanCepCandidato = cepCandidato.replace(/\D/g, '');
         const cleanCpfAdmFinanceiro = cpfAdmFinanceiro.replace(/\D/g, '');
         const cleanCepAdmFinanceiro = cepAdmFinanceiro.replace(/\D/g, '');

        const query = `UPDATE tbCandidato SET nrCandidato = ?, partido = ?, cargo = ?, municipio = ?, nmCandidato = ?, cnpj = ?,
                    enderecoCandidato = ?, cidadeCandidato = ?, cepCandidato = ?, cpfAdmFinanceiro = ?, rgAdmFinanceiro = ?, 
                    ecAdmFinanceiro = ?, profAdmFinanceiro = ?, nmAdmFinanceiro = ?, enderecoAdmFinanceiro = ?, cidadeAdmFinanceiro = ?, 
                    cepAdmFinanceiro = ?, dtInicioCampanha = ?, dtFimCampanha = ?, dtTrava =?, lmMilitantes = ?, lmVeiculos = ?
                    WHERE nrCandidato = ?`;
        connection.query(query, [nrCandidato, partido, cargo, municipio, nmCandidato, cleanCnpj,
            enderecoCandidato, cidadeCandidato, cleanCepCandidato, cleanCpfAdmFinanceiro, rgAdmFinanceiro,
            ecAdmFinanceiro, profAdmFinanceiro, nmAdmFinanceiro, enderecoAdmFinanceiro, cidadeAdmFinanceiro,
            cleanCepAdmFinanceiro, dtInicioCampanha, dtFimCampanha, dtTrava, lmMilitantes, lmVeiculos, originalNrCandidato], (err, result) => {
                if (err) {
                    console.error(err);
                    req.session.message = {
                        type: 'danger',
                        message: 'Erro ao atualizar o cadastro de candidato.'
                    };
                    res.redirect('/candidato');
                } else {
                    if (result.affectedRows === 0) {
                        req.session.message = {
                            type: 'warning',
                            message: 'Candidato não encontrado.'
                        };
                    } else {
                        req.session.message = {
                            type: 'success',
                            message: 'Cadastro de candidato atualizado com sucesso!'
                        };
                    }
                    res.redirect('/candidato');
                }
            });
    });

    // Delete CANDIDATO
    router.get('/candidato/delete/:nrCandidato', (req, res) => {
        let nrCandidato = req.params.nrCandidato;
        const query = 'DELETE FROM tbCandidato WHERE nrCandidato = ?';

        connection.query(query, [nrCandidato], (err, result) => {
            if (err) {
                console.error(err);
                res.json({ message: err.message });
            } else {
                if (result.affectedRows === 0) {
                    req.session.message = {
                        type: 'warning',
                        message: 'Candidato não encontrado.'
                    };
                } else {
                    req.session.message = {
                        type: 'info',
                        message: 'Candidato deletado com sucesso!'
                    };
                }
                res.redirect('/candidato');
            }
        });
    });

    // **Confirmar se candidato está cadastrado (para uso em Query de outras tabelas)**
    router.get('/api/check-candidato', (req, res) => {
        const { nrCandidato } = req.query;
        const query = 'SELECT nmCandidato FROM tbCandidato WHERE nrCandidato = ? LIMIT 1';

        connection.query(query, [nrCandidato], (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ exists: false });
            } else {
                if (results.length > 0) {
                    res.json({ exists: true, nmCandidato: results[0].nmCandidato });
                } else {
                    res.json({ exists: false });
                }
            }
        });
    });

    //-----------------------------------------------------------------------------------------------------

    //Operações VEÍCULO
    //Index
    router.get('/veiculo', (req, res) => {
        connection.query('SELECT * FROM tbVeiculo', (err, results) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.render('veiculo/index', { title: 'Veículos', veiculo: results });
            }
        });
    });

    //Página CREATE
    router.get('/veiculo/create', (req, res) => {
        res.render('veiculo/create', { title: 'Cadastrar Veículo' });
    });

    //Create VEÍCULO
    router.post('/veiculo/create', (req, res) => {
        const { municipio, nrCandidato, marca, modelo, ano, combustivel, valor, tipo, cgHoraria } = req.body;
        //Remove caracteres não numéricos
        const clearValor = valor.replace(/\D/g, '');
        //Transforma em decimal
        const decimalValor = clearValor / 100.0;
        const query = `INSERT INTO tbVeiculo (municipio, nrCandidato, marca, modelo, ano, combustivel, valor, tipo, cgHoraria) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        connection.query(query, [municipio, nrCandidato, marca, modelo, ano, combustivel, decimalValor, tipo, cgHoraria], (err, result) => {
            if (err) {
                res.status(500).json({ message: err.message, type: 'danger' });
            } else {
                req.session.message = {
                    type: 'success',
                    message: 'Veículo cadastrado com sucesso!'
                };
                res.redirect('/veiculo');
            }
        });
    });

    //View VEÍCULO
    router.get('/veiculo/view/:idVeiculo', (req, res) => {
        const idVeiculo = req.params.idVeiculo;
        const query = 'SELECT * FROM tbVeiculo WHERE idVeiculo = ?';

        connection.query(query, [idVeiculo], (err, results) => {
            if (err) {
                res.redirect('/');
            } else {
                if (results.length > 0) {
                    res.render('veiculo/view', {
                        title: 'Detalhes do veículo',
                        veiculo: results[0]
                    });
                } else {
                    res.redirect('/');
                }
            }
        });
    });

    // Página EDIT
    router.get('/veiculo/edit/:idVeiculo', (req, res) => {
        const idVeiculo = req.params.idVeiculo;
        const query = 'SELECT * FROM tbVeiculo WHERE idVeiculo = ?';

        connection.query(query, [idVeiculo], (err, results) => {
            if (err) {
                res.redirect('/');
            } else {
                if (results.length > 0) {
                    res.render('veiculo/edit', {
                        title: 'Editar Veículo',
                        veiculo: results[0]
                    });
                } else {
                    res.redirect('/');
                }
            }
        });
    });

    // Edit VEÍCULO
    router.post('/veiculo/edit/:idVeiculo', (req, res) => {
        const { idVeiculo } = req.params;
        const { municipio, nrCandidato, marca, modelo, ano, combustivel, valor, tipo, cgHoraria } = req.body;
        //Remove caracteres não numéricos
        const clearValor = valor.replace(/\D/g, '');
        //Transforma em decimal
        const decimalValor = clearValor / 100.0;
        const query = `UPDATE tbVeiculo SET municipio = ?, nrCandidato = ?, marca = ?, modelo = ?, ano = ?,
         combustivel = ?, valor = ?, tipo = ?, cgHoraria = ?
          WHERE idVeiculo = ?`;
        connection.query(query, [municipio, nrCandidato, marca, modelo, ano, combustivel, decimalValor, tipo, cgHoraria, idVeiculo], (err, result) => {
            if (err) {
                console.error(err);
                req.session.message = {
                    type: 'danger',
                    message: 'Erro ao atualizar o cadastro de veículo.'
                };
                res.redirect('/veiculo');
            } else {
                if (result.affectedRows === 0) {
                    req.session.message = {
                        type: 'warning',
                        message: 'Veículo não encontrado.'
                    };
                } else {
                    req.session.message = {
                        type: 'success',
                        message: 'Cadastro de veículo atualizado com sucesso!'
                    };
                }
                res.redirect('/veiculo');
            }
        });
    });


    // Delete VEÍCULO
    router.get('/veiculo/delete/:idVeiculo', (req, res) => {
        let idVeiculo = req.params.idVeiculo;
        const query = 'DELETE FROM tbVeiculo WHERE idVeiculo = ?';

        connection.query(query, [idVeiculo], (err, result) => {
            if (err) {
                console.error(err);
                res.json({ message: err.message });
            } else {
                if (result.affectedRows === 0) {
                    req.session.message = {
                        type: 'warning',
                        message: 'Veículo não encontrado.'
                    };
                } else {
                    req.session.message = {
                        type: 'info',
                        message: 'Veículo deletado com sucesso!'
                    };
                }
                res.redirect('/veiculo');
            }
        });
    });
    //-----------------------------------------------------------------------------------------------------
    //Operações SALÁRIO
    //Index
    // s = salario, f = funcao
    router.get('/salario', (req, res) => {
        connection.query(`SELECT s.idSalario, s.municipio, s.nrCandidato, s.idFuncao, s.valor, s.tipo, s.cgHoraria, f.nmFuncao
        FROM tbSalario s
        JOIN tbFuncao f ON s.idFuncao = f.idFuncao`, (err, results) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                res.render('salario/index', { title: 'Salários', salario: results });
            }
        });
    });

    //Página CREATE
    router.get('/salario/create', (req, res) => {
        const query = 'SELECT idFuncao, nmFuncao FROM tbFuncao';
        connection.query(query, (err, results) => {
            if (err) {
                res.status(500).json({ message: err.message, type: 'danger' });
            } else {
                res.render('salario/create', { title: 'Cadastrar Salário', funcoes: results });
            }
        });
    });

    //Create SALARIO
    router.post('/salario/create', (req, res) => {
        const { municipio, nrCandidato, idFuncao, valor, tipo, cgHoraria } = req.body;
        //Remove caracteres não numéricos
        const clearValor = valor.replace(/\D/g, '');
        //Transforma em decimal
        const decimalValor = clearValor / 100.0;
        const query = `INSERT INTO tbSalario (municipio, nrCandidato, idFuncao, valor, tipo, cgHoraria) 
        VALUES (?, ?, ?, ?, ?, ?)`;
        connection.query(query, [municipio, nrCandidato, idFuncao, decimalValor, tipo, cgHoraria], (err, result) => {
            if (err) {
                res.status(500).json({ message: err.message, type: 'danger' });
            } else {
                req.session.message = {
                    type: 'success',
                    message: 'Salário cadastrado com sucesso!'
                };
                res.redirect('/salario');
            }
        });
    });
    //View SALÁRIO
    router.get('/salario/view/:idSalario', (req, res) => {
        const idSalario = req.params.idSalario;
        const salarioQuery = 'SELECT * FROM tbSalario WHERE idSalario = ?';
        const funcoesQuery = 'SELECT idFuncao, nmFuncao FROM tbFuncao';

        connection.query(salarioQuery, [idSalario], (err, salarioResults) => {
            if (err) {
                res.redirect('/');
            } else if (salarioResults.length > 0) {
                connection.query(funcoesQuery, (err, funcoesResults) => {
                    if (err) {
                        res.redirect('/');
                    } else {
                        res.render('salario/view', {
                            title: 'Dados do Salário',
                            salario: salarioResults[0],
                            funcoes: funcoesResults
                        });
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    // Página EDIT
    router.get('/salario/edit/:idSalario', (req, res) => {
        const idSalario = req.params.idSalario;
        const salarioQuery = 'SELECT * FROM tbSalario WHERE idSalario = ?';
        const funcoesQuery = 'SELECT idFuncao, nmFuncao FROM tbFuncao';

        connection.query(salarioQuery, [idSalario], (err, salarioResults) => {
            if (err) {
                res.redirect('/');
            } else if (salarioResults.length > 0) {
                connection.query(funcoesQuery, (err, funcoesResults) => {
                    if (err) {
                        res.redirect('/');
                    } else {
                        res.render('salario/edit', {
                            title: 'Editar Salário',
                            salario: salarioResults[0],
                            funcoes: funcoesResults
                        });
                    }
                });
            } else {
                res.redirect('/');
            }
        });
    });

    //Edit SALÁRIO
    router.post('/salario/edit/:idSalario', (req, res) => {
        const { idSalario } = req.params;
        const { municipio, nrCandidato, idFuncao, valor, tipo, cgHoraria } = req.body;
        //Remove caracteres não numéricos
        const clearValor = valor.replace(/\D/g, '');
        //Transforma em decimal
        const decimalValor = clearValor / 100.0;
        const query = `UPDATE tbSalario SET municipio = ?, nrCandidato = ?, idFuncao = ?, valor = ?, tipo = ?, cgHoraria = ?
                        WHERE idSalario = ?`;
        connection.query(query, [municipio, nrCandidato, idFuncao, decimalValor, tipo, cgHoraria, idSalario], (err, result) => {
            if (err) {
                console.error(err);
                req.session.message = {
                    type: 'danger',
                    message: 'Erro ao atualizar o cadastro de salário.'
                };
                res.redirect('/salario');
            } else {
                if (result.affectedRows === 0) {
                    req.session.message = {
                        type: 'warning',
                        message: 'Salário não encontrado.'
                    };
                } else {
                    req.session.message = {
                        type: 'success',
                        message: 'Cadastro de salário atualizado com sucesso!'
                    };
                }
                res.redirect('/salario');
            }
        });
    });

    // Delete SALARIO
    router.get('/salario/delete/:idSalario', (req, res) => {
        let idSalario = req.params.idSalario;
        const query = 'DELETE FROM tbSalario WHERE idSalario = ?';

        connection.query(query, [idSalario], (err, result) => {
            if (err) {
                console.error(err);
                res.json({ message: err.message });
            } else {
                if (result.affectedRows === 0) {
                    req.session.message = {
                        type: 'warning',
                        message: 'Salário não encontrado.'
                    };
                } else {
                    req.session.message = {
                        type: 'info',
                        message: 'Salário deletado com sucesso!'
                    };
                }
                res.redirect('/salario');
            }
        });
    });





    // End point
    return router;
};
