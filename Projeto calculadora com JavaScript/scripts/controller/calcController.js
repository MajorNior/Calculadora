class CalcController { //criando uma classe separada para ser ultilizada em varias areas do projeto
    
    constructor(){//metodo contrutor e chamado altomaticamente quando tem uma estancia de uma classe

        //declarando elementos HTML para o javascript vazendo um vinculo entre os elementos
        this._audio = new Audio('click.mp3')
        this._audioOnOff = false; 
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEL = document.querySelector("#display");//ultilizando a função queryselector para selecionar pelo id
        this._dateEL = document.querySelector("#data");
        this._timeEL = document.querySelector("#hora");
        this._currentDate;//criação de um atributo privado ultilizando o _
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    pasteFromClipboard(){

        document.addEventListener('paste', e=>{
            
            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

            //console.log(text)
        });

    }

    copyToClipboard(){//metodo para criar uma area de transferencia para COPIAR
//ultilizado todo o processo de comando para SVG
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("copy");

        input.remove();

    }

//-------------------------------------------------------------------------------------------------------------------------------------------
                                         //TRABALHANDO COM DOM
        
    initialize(){//criação de um metodo para que quando a calculara iniciar ela começar por aqui 
        
        //**FOi COLOCADOS OS ELEMENTOS HTML DENTRO DO CONTRUCTOR**//

            this.setDisplayDateTime();
          setInterval(()=>{//trabalha com intervalos para executar uma ação sem parar

            this.setDisplayDateTime();//foi criado um metodo para poder fazer rolar o horario e data

          }, 1000); 

          this.setLastNumberToDisplay(); 
          this.pasteFromClipboard();    

          //colocando som ao clicar 2 vezes no botao AC
          document.querySelectorAll('.btn-ac').forEach(btn=>{

            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();//metodo
            });

          });
         
          /*
          setTimeout(()=>{
            alert("ola");
          }, 10000);//trabalha com intervalos para executar uma ação com pausas
        */
    }

    toggleAudio(){//metodo para saber se vai tocar ou nao o som (true ou false)

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){//metodo para chamar o audio escolhido do construcctor

        if(this._audioOnOff){
            
            this._audio.currentTime = 0;//para fazer o audio sempre voltar do inicio assim que clicar em outra tecla
            this._audio.play();

        }

    }

//-------------------------------------------------------------------------------------------------------------------------------------------

    
    initKeyboard(){//metodo para comandos do teclado

        document.addEventListener('keyup', e=>{//keypres = precinar tecla / keydown = segurar tecla / keyup = soltar tecla 

            //console.log(e, key);
            this.playAudio();
            switch (e. key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                    case '-':
                        case '*':
                            case '/':
                                case '%':
                    this.addOperation(e. key);
                    break;
                case 'Enter':
                    case '=':
                    this.calc();
                    break;
                case '.':
                    case ',':
                    this.addDot();
                    break;
                      
                case '0':   
                case '1':      
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e. key));
                    break;       
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }

        });

    }


    addEventListenerAll(element, events, fn){//cliando um metodo para fazer varios eventos em 1 local(elementos= variavel, events= click ou drag etc.., fn= funcção o codigo para fazer os eventos)
            //SPLIT para converter uma string em array para poder fazer a separação dos eventos click e drag
        events.split(' ').forEach(event => {
            
            element.addEventListener(event, fn, false);

        });

    }

    clearAll(){//metodo para limpar tudo

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }


    clearEntry(){//metodo para limpar

        this._operation.pop();

        this.setLastNumberToDisplay();

    }

    getLastOperation(){//metodo para pegar a ultima posição do array

        return this._operation[this._operation.length-1];//faz com que pegue o ultimo penutimo item do array (tenho 30 = "sinal de operação" itens pega o 29 = "numero a ser calculado")

    }

    isOperator(value){

        return (['+', '-','*', '/', '%'].indexOf(value) > -1); //indexOf vai buscar o valor no array do metodo isoperator para passa para o if do addOperation fazendo com que ele ultilize os operadores para fazer os calculos e serem reconhecidos.
            
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    pushOperation(value){//metodo para verificar se tem mais de 3 calculos para serem feitos (calcular em pares 1 + 1 / errado = 1 + 1 + 1)
        
        this._operation.push(value);

        if(this._operation.length > 3){

            //let last = this._operation.pop();
            

            this.calc();

            //console.log(this._operation);

        }


    }

    getResult(){
        try{
            return eval(this._operation.join(""));
        }catch(e){//erro para calculo sem operador salvo antess
            setTimeout(()=>{
                this.setError();
            }, 1)
            
        }

    }

    calc(){//metodo para fazer o calculos

        let last = '';

        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if(this._operation.length > 3){
            last = this._operation.pop();//para retitar o proximo operador para fazer o calculo
            
            this._lastNumber = this.getResult();
        
        }else if(this._operation.length == 3){

            
            this._lastNumber = this.getLastItem(false);

        }
//console.log("ultimooperador",this._lastOperator);
//console.log("ultimonumero",this._lastNumber);
        //calculo da porcentagem
        let result = this.getResult();

        if(last == '%'){

          result /= 100;

          this._operation = [result];

        }else {

        this._operation = [result];

        if(last) this._operation.push(last);

        }


        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true){

        let lastItem;
                
                    for(let i = this._operation.length-1;i >=0;i--){
    
                            if(this.isOperator(this._operation[i]) == isOperator){
                                lastItem = this._operation[i];
                                break;
                    }
                
                }
                    if(!lastItem){

                        lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

                    }

                return lastItem;
    }


    setLastNumberToDisplay(){//metodo para demonstrar os calculos no display sem repetir os numeros de calculo

    
        let lastNumber = this.getLastItem(false);
        
        if(!lastNumber)lastNumber = 0;

        this.displayCalc = lastNumber;

    }

//adicionando o numero
    addOperation(value){//metodo para adicionar as operaçoes 
       // console.log('A',value,  isNaN(this.getLastOperation()));
        if(isNaN(this.getLastOperation())){//usando isNaN para para valiadar se oque esta sendo digitado e um numero ou uma string(false =  number / true = string)
                
            //string
            if(this.isOperator(value)){

                this.setDisplayDateTime(value);
                //trocar o operador

            }else{
    
                this.pushOperation(value);

                this.setLastNumberToDisplay();//chamando o metodo para aparecer numeros no display
            }  

        }else {

            if(this.isOperator(value)){

                 this.pushOperation(value);

            }else{
                //alterando o numero
                let newValue = this.getLastOperation().toString() + value.toString(); //number
                this.setLastOperation(newValue);//metodo push para adicionar um item no array e pop para retirar

                this.setLastNumberToDisplay();
                
            }
            
        }

        
            //console.log(this._operation);
    }

    setError(){//metodo para mostrar um erro

            this.displayCalc = 'Error';

    }

    addDot(){//metodo para ultilizar ponto

       let lastOperation = this.getLastOperation();//pega o valor da ultima operação

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;//spit para percorrer o array e selecionaro o valor ponto para nao perder o valor

       if(this.isOperator(lastOperation) || !lastOperation){//verificando se o operador  ponto existe ou nao

        this.pushOperation('0.');//adicionando um novo item na operação

       }else {

        this.setLastOperation(lastOperation.toString() + '.');//sobre escrever a operação mas sem perder ela

       }

       this.setLastNumberToDisplay();//atualizar telas

    }

    execBtn(value){//metodo com switch para executar função de cada botoes, ultilizando metodos criados acima
        

        this.playAudio();

        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;
                  
            case '0':   
            case '1':      
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));//usando parseInt para transformar as strings dos numeros em Numero inteiros    
                break;       

            default:
                    this.setError();
                break;
        }


    }


    initButtonsEvents(){
                //querySelectorAll me tras todos os elementos que eu selecionei (tags g)
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");//usando querySelector para selecionar o id e a tag G dos bottons

        buttons.forEach((btn, index)=>{//ultilizando o foreach para fazer o evento de click em todos os buttons
             
            this.addEventListenerAll(btn, 'click drag', e=> {//evento click (evento de clicar em algo)/ evento drag (evento de arrastar)

                //console.log(btn.className.baseVal.replace('btn-', ''));//trazendo no console a tag do botao com a classe/ com className.baseVal para trazer apenas o nome do botao/ e com raplace para retirar conteudos do nome do botao que nao sao uteis como o btn
                let textBtn = btn.className.baseVal.replace('btn-', '');

                this.execBtn(textBtn);//fazendo executar o metodo execBtn para botoes especificos cahmando a variavel textBtn do array dos bottoes


            });



                //add pointer no cursor (maozinha quando passa o mouse no botao)
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
                btn.style.cursor ='pointer';
            });

        })

    }



        setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: '2-digit',
            month: "short", // fazendo a data ficar formatada para abreviação escrita
            year: 'numeric'
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale); 
        
    }


//get e set serve para controlar como o atributo deve ser consutado ou alimentado de informaçoes
    
    
    get displayTime(){//Hora
        this._timeEL.innerHTML;
    }

        set displayTime(value){
             this._timeEL.innerHTML = value;
        }

    get displayDate(){//data
        return this._dateEL.innerHTML;
    }

        set displayDate(value){
             this._dateEL.innerHTML = value;
        }


    get displayCalc(){ //para visualizar o  value do atributo se ultiliza get
        return this._displayCalcEL.innerHTML;//innerHTML -> vai pegar o objeto descrito e colocara uma informação nova no formato HTML
    }

    set displayCalc(value){//para atribuir value ou auterar se ultiliza set
        
        if(value.toString().length > 10){//processo para nao ultrapassar 10 digitos no display
            this.setError();
            return false;
        }
        
        this._displayCalcEL.innerHTML = value;//innerHTML -> vai pegar o objeto descrito e colocara uma informação nova no formato HTML
    }

    get currentDate(){
        return new Date();
    }

    set currentDate(value){
        this._currentDate = value;
    }
}