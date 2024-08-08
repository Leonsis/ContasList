class Despesa {

    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDado() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}


class Bd {
    
    constructor() {
        let id = localStorage.getItem('id');
        if(id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')// null
        return parseInt(proximoId) + 1;
    }

    gravar(despesa) {
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(despesa));//Metodo JSOM para traformar caracteres literais em caracteres JSOM
        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {
        // Array de despesas
        let despesas = Array();

        let id = localStorage.getItem('id');

        // Estrutura de repetição para recuperar os ids do localStorage
        for(let i = 1; i <= id; i++) {
            //Recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i));// Metodo JSOM para tremformar os caracteres JSOM em caracteres Literais
            /*
                Estrutura de decisão para verificar se existe ou não indces que foram removidos,
                neste caso nós vamos  pular esses indces
            */
            if(despesa === null) {
                continue;
            }
            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array(); 
        despesasFiltradas =  this.recuperarTodosRegistros();
        
        if(despesa.ano != '') {
            console.log('Filtro ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        if(despesa.mes != '') {
            console.log('Filtro mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        if(despesa.dia != '') {
            console.log('Filtro dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        if(despesa.tipo != '') {
            console.log('Filtro tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }
        
        if(despesa.descricao != '') {
            console.log('Filtro descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        if(despesa.valor != '') {
            console.log('Filtro valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id);
    }    
}
const bd = new Bd;


function cadastrarDespesa() {    
    const ano = document.getElementById('ano');    
    const mes = document.getElementById('mes');
    const dia = document.getElementById('dia');
    const tipo = document.getElementById('tipo');
    const descricao = document.getElementById('descricao');
    const valor = document.getElementById('valor');

    const despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    )

    const titulo = document.getElementById('titulo');
    const obs = document.getElementById('obs');
    const botao = document.getElementById('botao');
    if(despesa.validarDado()) {
        bd.gravar(despesa);
        titulo.innerHTML = 'Registrado';
        titulo.classList.remove('text-danger');
        obs.innerHTML = 'Despesa registrada com sucesso';
        botao.innerHTML = 'Voltar'
        botao.classList.add('sucessoBotao');
        botao.classList.remove('btn-danger');
        $('#modalRegistraDespesa').modal('show'); //Linha de código em Jquery;

        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
    } else {
        titulo.innerHTML = 'Erro ao registrar';
        titulo.classList.add('text-danger');
        obs.innerHTML = 'Não foi informado valores validos';
        botao.innerHTML = 'Voltar e corrigir';
        botao.classList.add('btn-danger');
        $('#modalRegistraDespesa').modal('show'); //Linha de código em Jquery;
    }
}

function carregaListaDespesas(despesas = Array()) {
    
    if(despesas.length == 0 ) {
        despesas = bd.recuperarTodosRegistros();
    }

    //Selecionando o elemento tbody da tabela
    const listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    //Percorrer o array despesas listando casda despesa de forma dimnamica
    despesas.forEach(function(d) {
         
        let linha = listaDespesas.insertRow();//Com o método isertRow é possivel inseririr linhas no código html

        //Criando as colunas
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
        //ajustar o tipo.
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação';
                break;
            case '2': d.tipo = 'Educação';
                break;
            case '3': d.tipo = 'Lazer';
                break;
            case '4': d.tipo = 'Saúde';
                break;
            case '5': d.tipo = 'Transporte';
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;//Com o método insertCell é possivel criar as colunas
        /*
            Neste caso estou fazendo uma fução de callback Aroow
            que está criando um linha e uma coluna para cada valor informado do array despessas,
            com o uso so forEach que percorre Array despesas;
        */

        //criando um botão de exclusão
        const button = document.createElement('button');
        button.classList.add('btn');
        button.classList.add('bg-danger');  
        button.innerHTML = '<i class="fas fa-times"></i>';
        button.id = `id_despesa_${d.id}`;
        button.onclick = function() {
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id);
            window.location.reload()
        }
        linha.insertCell(4).append(button);
    });
    /*
        Mas tabem pode ser feita da seguinte formar:
        despesa.forEach(function(d) {
            console.log(d)
        })
    */
}

function pesquisarDespesa() {
    const ano = document.getElementById('ano').value;
    const mes = document.getElementById('mes').value;
    const dia = document.getElementById('dia').value;
    const tipo = document.getElementById('tipo').value;
    const descricao = document.getElementById('descricao').value;
    const valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

    let despesas = bd.pesquisar(despesa)
    
    
    this.carregaListaDespesas(despesas)
}