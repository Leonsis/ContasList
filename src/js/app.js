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
        localStorage.setItem(id, JSON.stringify(despesa));
        localStorage.setItem('id', id);
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
    } else {
        titulo.innerHTML = 'Erro ao registrar';
        titulo.classList.add('text-danger');
        obs.innerHTML = 'Não foi informado valores validos';
        botao.innerHTML = 'Voltar e corrigir';
        botao.classList.add('btn-danger');
        $('#modalRegistraDespesa').modal('show'); //Linha de código em Jquery;
    }
}