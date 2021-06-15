//Core da aplicação

class Despesa{
    constructor(ano, mes, dia, tipo , descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados(){
        for(let a in this){
            console.log(this[a])
            if(this[a] == null || this[a] == '' || this[a] == undefined ){
                return false
            }
        }
        return true
    }
}

class DB {
    constructor(){        
        if(localStorage.getItem('id') === null){
            localStorage.setItem('id', 0)
            console.log("cria índice 0")
        }
    }
    getProxItem(){       
        var proxId = localStorage.getItem('id')
        return parseInt(proxId) + 1     
    }

    gravar(d){    
        let id = this.getProxItem()
        console.log(id)
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros(){        
        //Array de despesas
        let itens = Array()
        let id = localStorage.getItem('id')
        
        for(let i=1; i<=id; i++){
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){                   
                continue
            }
            despesa.id = i
            itens.push(despesa)
        }        
        //console.log(itens)
        return itens
    }
    pesquisar(despesa){
        let despesasFiltradas = this.recuperarTodosRegistros()
                
        //ano
        if(despesa.ano != ''){
            console.log('filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(f => f.ano == despesa.ano)
        }        

        //mes
        if(despesa.mes != ''){
            console.log('filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(f => f.mes == despesa.mes)
        }        

        //dia
        if(despesa.dia != ''){
            console.log('filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(f => f.dia == despesa.dia)
        }    

        //tipo
        if(despesa.tipo != ''){
            console.log('filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(f => f.tipo == despesa.tipo)
        }    

        //descricao
        if(despesa.descricao != ''){
            console.log('filtro de descricao')
            despesasFiltradas = despesasFiltradas.filter(f => f.descricao == despesa.descricao)
        }    

        //valor
        if(despesa.valor != ''){
            console.log('filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(f => f.valor == despesa.valor)
        }    

        console.log(despesa)
        console.log(despesasFiltradas)
        return despesasFiltradas
    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let db = new DB()

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    
    var mHeader = document.getElementById('m-header')
    var mTitle = document.getElementById('m-title')
    var mBody = document.getElementById('m-body')
    var m_btn = document.getElementById('m-btn')

    if(despesa.validarDados()){
        db.gravar(despesa)
        //dialog de sucesso
        mHeader.className += mHeader.className.includes('text-success') == '' ? ' '+'text-success' : ''
        mTitle.innerHTML = 'Dados cadastrados'
        mBody.innerHTML = 'Despesa cadastrada com sucesso.'
        m_btn.className = 'btn btn-success' 
        m_btn.innerHTML = 'Voltar'        
        $('#modalCadastrar').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

        //alert('Dados cadastrados com sucesso!')
    }else{
        //dialog de erro        
        mHeader.className += mHeader.className.includes('text-danger') == '' ? ' '+'text-danger' : ''
        mTitle.innerHTML = 'Erro ao cadastrar'
        mBody.innerHTML = 'Os dados estão inválidos. Verifique se todos os campos foram preenchidos corretamente!'
        m_btn.className = 'btn btn-danger' 
        m_btn.innerHTML = 'Voltar e corrigir'
        $('#modalCadastrar').modal('show')
        //alert('Dados inválidos!')
    }
}

function carregaListaDespesas(despesas=Array(), filter=false){
    
    if(despesas.length==0 && filter==false){
        despesas = db.recuperarTodosRegistros()
    }
    
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    despesas.forEach(element => {
        //criando linha (tr)
        let linha = listaDespesas.insertRow()
        
        //criando colunas (td)
        linha.insertCell(0).innerHTML = `${element.dia}/${element.mes}/${element.ano}`
        //Ajustar o tipo        
        switch(parseInt(element.tipo)){
            case 1:
                element.tipo = 'Alimentação'
                break
            case 2:
                element.tipo = 'Educação'
                break
            case 3:
                element.tipo = 'Lazer'
                break
            case 4:
                element.tipo = 'Saúde'
                break
            case 5:
                element.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = element.tipo        
        linha.insertCell(2).innerHTML = element.descricao
        linha.insertCell(3).innerHTML = element.valor
        let btn = document.createElement("button")
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.className = "btn btn-danger"
        btn.id = `id_despesa_${element.id}`
        btn.onclick = function(){            
            db.remover(element.id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)        
        console.log(element)     
    });    
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    despesas = db.pesquisar(despesa) //despesas

    carregaListaDespesas(despesas, true)
}