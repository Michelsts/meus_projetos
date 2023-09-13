const btCalcular = document.querySelector('#bt-calcular');
const btZerar = document.querySelector('#bt-zerar');
const tabela = document.querySelector('#tabela-body');
const tabelaFoot = document.querySelector('#tabela-foot');
const itens = JSON.parse(localStorage.getItem('itens')) || [];

somaTotalDasVendas(itens);

itens.forEach((elemento) => {
    criaElementos(elemento);
});

// EVENTO E FUNÇÃO PARA OBTER OS VALORES E CALCULAR

btCalcular.addEventListener('click', function calcularComissao(evento) {
    const venda = parseFloat(document.getElementById('vendaid').value);
    const frete = parseFloat(document.getElementById('frete').value);
    const cimento = parseFloat(document.getElementById('cimento').value);
    const telha = parseFloat(document.getElementById('telha').value);
    const resul = document.getElementById('resultado');
    const avista = document.getElementById('avista');
    const boleto = document.getElementById('boleto');
    const cartao = document.getElementById('cartao');
    const vezes = document.querySelector('#vezes').value;

    evento.preventDefault();

    var valor_descontado = 0;
    var valorFinal = 0;

    if (avista.checked) {
        valorFinal = venda;
    }
    if (cartao.checked) {
        let valorcartao = venda - venda * 0.04;
        valorFinal = valorcartao - valorcartao * (vezes * 0.015);
    }
    if (boleto.checked) {
        let valorboleto = venda - venda * 0.04;
        valorFinal = valorboleto - valorboleto * (vezes * 0.015) - vezes * 3.5;
    }

    valor_descontado = valorFinal - frete - cimento / 2 - telha / 2;

    resul.innerHTML = `${valor_descontado.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
    })}`;

    console.log(valor_descontado);

    let valor = { valor: valor_descontado, venda: venda };

    listaValores(valor);
    criaElementos(valor);
    form.reset();
});

//  CRIA UMA LISTA COM VALORES E ADICONA EM MEMÓRIA

function listaValores(valor) {
    const valorAtual = {
        venda: valor.venda,
        valor: valor.valor,
    };

    itens.push(valorAtual);
    localStorage.setItem('itens', JSON.stringify(itens));
}

// FUNÇÃO PARA CRAIR NOVOS ELEMENTOS NA TABELA

function criaElementos(valor) {
    const novoItem = document.createElement('tr');
    let valorDaVenda = valor.venda;
    let valorDaComissao = valor.valor;

    novoItem.innerHTML = `<td>
     ${valorDaVenda.toLocaleString('pt-br', {
         style: 'currency',
         currency: 'BRL',
     })} 
     </td>
     
     <td> 
     ${valorDaComissao.toLocaleString('pt-br', {
         style: 'currency',
         currency: 'BRL',
     })} 
    </td>`;

    tabela.appendChild(novoItem);
    novoItem.appendChild(botaoDeleta(valor.id));
}

// FUNÇÃO PARA CALCULAR TOTAIS DE VENDAS E COMISSÃO

function somaTotalDasVendas(itens) {
    const totalVenda = [];
    for (let i in itens) {
        totalVenda.push(parseFloat(itens[i].venda));
    }
    const somaTotal = totalVenda.reduce(
        (acumulador, atual) => acumulador + atual,
        0
    );

    const totalComissao = [];
    for (let i in itens) {
        totalComissao.push(parseFloat(itens[i].valor));
    }
    const somaComissao = totalComissao.reduce(
        (acumulador, atual) => acumulador + atual,
        0
    );

    const imprimirVendas = document.createElement('tr');
    imprimirVendas.innerHTML = `<td> ${somaTotal.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
    })}</td><td> ${somaComissao.toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL',
    })}</td>`;
    tabelaFoot.appendChild(imprimirVendas);
}

// FUNÇÃO PARA ADICIONAR O BOTÃO DELETAR

function botaoDeleta() {
    const elementoBotao = document.createElement('button');
    elementoBotao.setAttribute('class', 'btn_x');
    elementoBotao.innerHTML = 'X';

    elementoBotao.addEventListener('click', function () {
        deletaElemento(this.parentNode);
    });

    return elementoBotao;
}

// FUNÇÃO CHAMADA PARA DELETAR ITEM

function deletaElemento(tag, id) {
    tag.remove();

    itens.splice(
        itens.findIndex((elemento) => elemento.id === id),
        1
    );

    localStorage.setItem('itens', JSON.stringify(itens));

    atualizarVendas();
}

// FUNÇÃO PARA ZERAR INPUTS COM VALORES

btZerar.addEventListener('click', function resetar() {
    let form = document.getElementById('form');
    let result = document.getElementById('resultado');

    form.reset();
    result.innerHTML = 'R$ 0,00';
});

function zerarDia() {
    var remover = itens.length;
    itens.splice(0, remover);
    atualizarVendas();
    localStorage.setItem('itens', JSON.stringify(itens));
}

function atualizarVendas() {
    document.location.reload(false);
    window.location.href = '#vendas';
}
