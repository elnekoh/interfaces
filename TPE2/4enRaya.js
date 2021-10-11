document.addEventListener("DOMContentLoaded", () =>{
    
    //declaracion de clases
    /**
     * La clase figura es la madre de todos los objetos, podria llamarse de otra manera,
     * ya que algunos objetos como Board, tecnicamente no es una figura en la vida real.
     * tal vez podrian llamarse "objetos", u "objetoDibujable".
     * ninguno de esos nombres me convencio asi que se sigue llamando figura por ahora.
     * los objetos de tipo figura guardan su pos X e Y, un atributo llamado "fill", que es el color
     * y el contexto donde deben ser dibujados
     * comparten sus principales getters y setters de atributo, y de una funcion llamada "draw()"
     * la funcion draw lo que debe hacer es dibujar la figura de la manera que este determinada en su clase
     * (por ejemplo en la clase Circle, para dibujarse debe hacer uso de la funcion arc() del contexto)
     */
    class Figure{
        constructor(posX, posY, fill, context){
            this.posX = posX;
            this.posY = posY;
            this.fill = fill;
            this.context = context;
        }
    
        setFill(fill){
            this.fill = fill;
        }
    
        getPos(){
            return {
                x: this.getPosX(),
                y: this.getPosY()
            };
        }
    
        getPosX(){
            return this.posX;
        }
        setPosX(x){
            this.posX = x;
        }
    
        getPosY(){
            return this.posY;
        }
        setPosY(y){
            this.posY = y;
        }
    
    
        getFill(){
            return this.fill;
        }

        
    
        draw(){
            this.context.fillStyle = this.getFill();
        }
    }

    /**
     * la circle es capaz de dibujar un circulo
     */
    class Circle extends Figure{
        constructor(posX, posY, fill, context, radius){
            super(posX, posY, fill, context);
            this.radius = radius;
        }
    
        draw(){
            super.draw();
            this.context.beginPath();
            this.context.arc(this.getPosX(), this.getPosY(), this.getRadius(), 0, 2*Math.PI);
            this.context.fill();
            this.context.closePath();

            this.context.beginPath();
            this.context.arc(this.getPosX(), this.getPosY(), this.getRadius(), 0, 2*Math.PI);
            this.context.lineWidth = 3;
            this.context.lineCap = "round";
            this.context.strokeStyle = "black";
            this.context.stroke();
            this.context.closePath();
        }
    
        getRadius(){
            return this.radius;
        }
    }

    /**
     * la clase token dibuja un circulo, y ensima de el dibuja una imagen,
     * solo si recibio la url de la misma como parametro
     */
    class Token extends Circle{
        constructor(posX, posY, fill, context, radius,imgUrl){
            super(posX, posY, fill, context,radius,imgUrl);
            this.imgUrl = imgUrl;
        }

        getImgUrl(){
            return this.imgUrl;
        }

        draw(){
            super.draw();
            let thumbImg = document.createElement('img');

            thumbImg.src = this.imgUrl;
            thumbImg.onload = this.loadImg(this.context,thumbImg);
        }

        /**
         * esta funcion recive el contexto y una img para dibujar en el circulo 
         * que anteriormente se dibujo (en super.draw())
         * 
         * @param {Context} c 
         * @param {img} img 
         */
        loadImg(c,img){
            c.save();
            c.beginPath();
            c.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI, true);
            c.clip();
            c.closePath();

            c.drawImage(img, this.posX-this.radius, this.posY-this.radius, this.radius*2, this.radius*2);

            c.beginPath();
            c.arc(this.posX, this.posY, this.radius, 0, 2*Math.P);
            c.clip();
            c.closePath();
            c.restore();
        }
    }
    
    /**
     * esta clase puede dibujar un cuadrado
     */
    class Square extends Figure {
        constructor(posX, posY, fill, context, size){
            super(posX, posY, fill, context);
            this.size = size;
        }

        draw(){
            super.draw();
            this.context.beginPath();
            this.context.rect(this.getPosX(), this.getPosY(), this.getSize(),this.getSize());
            this.context.fill();
            this.context.closePath();
        }
        
        getSize(){
            return this.size;
        }
    }

    /**
     * Esta clase es para el tablero del juego el tablero tiene como finalidad: 
     * >dibujar cada "azulejo" donde va cada ficha, y cada ficha colocada.
     * >guardar en uno de sus atributos la posicion de cada ficha.
     * >comprobar si algun jugador gano.
     */
    class Board extends Figure{
        constructor(posX,posY,sizePerTile, columns, rows, fill,context){
            super(posX,posY,fill,context);
            this.sizePerTile = sizePerTile;
            this.rows = rows;
            this.columns = columns;
            this.defaultColorToken = "rgba(100,100,255,255)"//hacer una ficha negra jeje
            this.placedTokens =[];
            this.emptyBoard();
        }

        /**
         * placedTokens es una matriz, que representa el estado actual de el tablero,
         * cada vez que se tenga que dibujar un "azulejo" del tablero, se le consultara a esta matriz como
         * dibujar cada pieza, para saber que ficha dibujar ahi.
         * y cada vez que se coloque alguna ficha en el tablero, se le consultara a esta matriz si hay espacio para que entre
         * 
         * cada elemento de esta matriz es un JSON de dos atributos "fill" y "imgUrl" (para crear cada ficha de el tablero 
         * solo necesitamos saber esos dos datos)
         * 
         * cada "azulejo" disponible en el tablero debera ser dibujado con el color por defecto, y sin imagen.
         * con esta funcion llenamos la matriz de elementos por defecto
         */
        emptyBoard(){
            for (let i = 0; i < this.getRows(); i++) {
                this.placedTokens[i] = [];
                for (let j = 0; j < this.getColumns(); j++) {
                    this.placedTokens[i][j] = {
                        "fill" : this.defaultColorToken,
                        "imgUrl": ""
                    };
                }
            }
        }

        /**
         * con esta funcion, el tablero determina en que espacio del mismo "caera"
         * la fila en la que cayo, y si no habia espacio para esa ficha, retorna null
         * 
         * @param {number} pos es la columna donde se quiere colocar la ficha
         * @param {string} color el fill de la ficha
         * @param {string} imgUrl img de la ficha
         * @returns {number} i La funcion retorna la fila en que la ficha fue colocada
         * @returns {null} null Si no habia espacio para la ficha, esta funcion retorna null
         */
        setToken(pos, color,imgUrl){
            /**
             * primero le asigna un string vacio a imgUrl por si este vino undefined
             */
            if(imgUrl == undefined || imgUrl == null){
                imgUrl = "";
            }
            /**
             * comenzando desde abajo en el tablero, nos fijamos si tiene espacio disponible, si es asi
             * colocamos en la matriz los valores "fill"y "imgUrl" en el espacio correspondiente.
             */
            for (let i = this.getRows()-1; i >= 0; i--) {
                if (this.placedTokens[i][pos].fill == this.defaultColorToken){
                    this.placedTokens[i][pos].fill = color;
                    this.placedTokens[i][pos].imgUrl =imgUrl; 
                    return i;
                }
            }
            return null;
        }

        /**
         * 
         * @param {number} x filas
         * @param {number} y columnas
         * @param {number} gameMode numero de fichas necesarias para que el se considere que un jugador gano
         * @returns true o false
         */
        checkWin(x,y,gameMode){
            /**
             * existen 3 formas de que un jugador gane
             * colocando 4 (o la cantidad que diga "gameMode") fichas en linea recta juntas de manera horizontal
             * o de manera vertical, u diagonal (y a su vez diagonal en este caso tiene 2 maneras de detectarse)
             * 
             * por lo que, para checkear si se ha ganado, tenemos que revisar que eso haya ocurrido, y es lo que las 
             * 4 funciones citadas en este if hacen, tan solo una devuelve true, el jugador ganó
             */
            if (this.checkHorizontal(x,y,gameMode) || this.checkVertical(x,y,gameMode) || this.checkDiagonalLeft(x,y,gameMode) || this.checkDiagonalRight(x,y,gameMode)) {
                return true;
            }else{
                return false;
            }
        }
        //f filas
        //c columnas

        /**
         * 
         * @param {number} f fila de la ficha colocada
         * @param {number} c columna de la ficha colocada
         * @param {number} ticks numero de fichas que deben estar alineadas para ganar.
         * @returns true o false
         */
        checkVertical(f,c,ticks){
            /**
             * la funcion empieza tomando el color de la ficha colocada
             */
            let initialPos = this.placedTokens[f][c].fill;
            /**
             * actualtoken, es la ficha con la que se comparara nuestra ficha colocada (en cada iteracion
             * actualtoken es reemplazaada por la siguiente ficha)
             */
            let actualToken = null;
            for (let i = 0; i <= ticks-1; i++) {
                /**
                 * f+i, f es filas como es de esperarse, aumentara cada iteracion para ir comparando verticalmente, 
                 * si llega a ser igual a la cantidad de filas, no entrara al if, actualtoken quedara en null
                 * y entonces la ejecucion tendra que entrar si o si en el siguiente if, que compara el color
                 * del token inicial con el actualtoken
                 * 
                 * si el color es diferente, ya sea, por el color por defento de un espacio vacio, o el color 
                 * de la ficha de el otro jugador, entonces tambien entrara a el segundo if, retornando false 
                 */
                if(f+i < this.getRows()){
                    actualToken = this.placedTokens[f+i][c].fill;
                }
                if(actualToken != initialPos){
                    return false;
                }
                actualToken = null;
            }
            return true;
        }

        /**
         * la funcionalidad de todos estos "check" es la misma, se diferencia nada mas en el while (ausente en el vertical)
         * el while lo que hace es verificar si la ficha que esta colocada detras de la que se esta comprobando es del mismo color
         * si este es el caso, empezaremos a comprobar desde la anterior.
         * como es un while, retrocedera hasta que la condicion de falso
         * 
         * cada while tiene su propio control para no comprobar espacios que no existen en la matriz "placed tokens"
         * @param {number} f filas 
         * @param {*} c columnas
         * @param {*} ticks numero de fichas que deben estar alineadas para ganar.
         * @returns true o false
         */
        checkHorizontal(f,c,ticks){
            let initialPos =this.placedTokens[f][c].fill;
            let actualToken = null;
            while (c-1 >= 0 && this.placedTokens[f][c-1].fill == initialPos) {
                initialPos = this.placedTokens[f][c-1].fill;
                c--;
            }
            for (let i = 0; i <= ticks-1; i++) {
                if(c+i < this.getColumns()){
                    actualToken = this.placedTokens[f][c+i].fill;
                }
                if(actualToken != initialPos){
                    return false;
                }
                actualToken = null;
            }
            return true;
        }
        checkDiagonalLeft(f,c,ticks){
            let initialPos =this.placedTokens[f][c].fill;
            let actualToken = null;
            while (f-1 >= 0 && c-1 >= 0 && this.placedTokens[f-1][c-1].fill == initialPos) {
                initialPos = this.placedTokens[f-1][c-1].fill;
                f--;
                c--;
            }
            for (let i = 0; i <= ticks-1; i++) {
                if(f+i < this.getRows() && c+i < this.getColumns()){
                    actualToken = this.placedTokens[f+i][c+i].fill;
                }
                if(actualToken != initialPos){
                    return false;
                }
                actualToken = null;
            }
            return true;
        }

        checkDiagonalRight(f,c,ticks){
            let initialPos =this.placedTokens[f][c].fill;
            let actualToken = null;
            while (f-1 >= 0 && c+1 < this.getColumns() && this.placedTokens[f-1][c+1].fill == initialPos) {
                initialPos = this.placedTokens[f-1][c+1].fill;
                f--;
                c++;
            }
            for (let i = 0; i <= ticks-1; i++) {
                if(f+i < this.getRows() && c-i >= 0){
                    actualToken = this.placedTokens[f+i][c-i].fill;
                }
                if(actualToken != initialPos){
                    return false;
                }
                actualToken = null;
            }
            return true;
        }

        /**
         * para dibujarse, el tablero usa un "tileModel", que es un cuadrado (yo suelo llamar cada tile "azulejo")
         * este cuadrado tiene como parametros, la poscicion X e Y del tablero, el color del tablero, el contexto, 
         * y el tamaño que tiene que tener cada azulejo
         */
        draw(){
            const circles = [];
            const tiles = [];
            const tileModel = new Square(this.getPosX(),this.getPosY(),this.getFill(),ctx,this.getSizePerTile());

            //i  filas
            //j  columnas

            /**
             * creamos 2 matrices de objetos, que seran cuadrados y fichas
             * anteriormente se usaban 4 fors en esta funcion
             * 2 para crear la matrices, y otros dos los cuales dibujan cada uno de estos elemenos,
             * simplefique el codigo haciendo estas 2 acciones en los priemeos 2 for
             */
            for (let i = 0; i < this.getRows(); i++) {
                tiles[i] = [];
                circles[i] = [];
                for (let j = 0; j < this.getColumns(); j++) {
                    /**
                     * cada azulejo tiene como posX, la posicion X de tileModel + el tamaño de este multiplicado * las columnas
                     * como posY es similar, posY de tileModel + el tamaño de este * las filas
                     * revisando esto, me di cuenta que puede hacerse sin crear matrices, pero por falta de tiempo lo dejare como esta
                     * luego cada otro atributo, es copiado de tilemodel
                     */
                    tiles[i][j] = new Square(this.getPosX()+tileModel.getSize()*j,this.getPosY()+tileModel.getSize()*i,this.getFill(),this.context,tileModel.getSize());
                    /**
                     * en el caso de los tokens, pertenecen a una matriz llamada circulos (por que anteriormente en lugar de tokens, se rellenaba con circulo)
                     * las posX y la pos Y es la de su correspondiente azulejo, sumado al tamaño dividido 2 (asi queda en el centro)
                     * el fill y la img, se obtiene de placedTokens y el radio es de casi un 40% del tamaño de cada azulejo
                     */
                    circles[i][j] = new Token(tiles[i][j].getPosX()+ tiles[i][j].getSize()/2,tiles[i][j].getPosY()+ tiles[i][j].getSize()/2,this.placedTokens[i][j].fill,this.context,tiles[i][j].getSize()*.39,this.placedTokens[i][j].imgUrl);
                    tiles[i][j].draw();
                    circles[i][j].draw();
                }
            }
            /**
             * aqui dibujo la linea nefra que rodea al tablero
             * posX y posY, son las del tablero, el tamaño del rect es proporcional al la cantidad de columnas y de filas
             */
            this.context.beginPath();
            this.context.rect(this.getPosX(), this.getPosY(),this.getSizePerTile()*this.getColumns(),this.getSizePerTile()*this.getRows());
            this.context.lineWidth = 3;
            this.context.lineCap = "round";
            this.context.strokeStyle = "black";
            this.context.stroke();
            this.context.closePath();
        }

        getColumns(){
            return this.columns;
        }

        setColumns(columns){
            this.columns = columns;
        }

        getRows(){
            return this.rows;
        }

        setRows(rows){
            this.rows = rows;
        }

        getSizePerTile(){
            return this.sizePerTile;
        }

        getWidth(){
            return this.getColumns()*this.getSizePerTile();
        }
        getHeight(){
            return this.getRows()*this.getSizePerTile();
        }
    }

    /**
     * la clase contendra un tablero, y un par de fichas
     * >la funcionalidad de esta clase es la de dibujar todo en pantalla
     * >cambiar las fichas
     * >cambiar el timer
     * >dar a conocer quien gano
     * >determinar si el jugador puso una ficha en la parte superior del tablero (si es asi, colocarla en el tablero)
     * >tambien puede cambiar el tamaño del tablero
     */
    class Game {
        constructor(board,token1,token2,context){
            this.board = board;
            this.tokens =[];
            this.tokens.push(token1);
            this.tokens.push(token2);
            this.objects = [];
            this.objects.push(board);
            this.objects.push(this.tokens[0]);
            this.context = context;
            this.timerId = null;
            this.gameMode = 4;
            this.timer = 500000
        }

        /**
         * con drawAll() game dibuja los grupos de fichas que representa a cada jugador,
         * la ficha arrastrable en su posicion actual,
         * y el tablero
         */
        drawAll(){
            /**
             * primero que nada canva en blanco
             */
            this.context.fillStyle = "white";
            this.context.fillRect(0,0,canva.width,canva.height);
            /**
             * dibuja el tablero y la ficha arrastrable
             */
            for (let i = 0; i < this.objects.length; i++) {
                if(this.objects[i] != null){
                    this.objects[i].draw();
                }
            }
            /**
             * dibuja los grupos de fichas
             */
            if(this.objects[1] != null){
                let token = new Token(50,50,this.tokens[0].getFill(),this.context,this.tokens[0].getRadius(),this.tokens[0].getImgUrl());
                this.drawTokens(token);
                token = new Token(50,150,this.tokens[1].getFill(),this.context,this.tokens[1].getRadius(),this.tokens[1].getImgUrl());
                this.drawTokens(token);
            }
        }

        /**
         * recibe un token para dibujar el grupito de fichas
         * @param {Token} token 
         */
        drawTokens(token){
            for (let i = 0; i < 4; i++) {
                token.draw()
                token.setPosX(token.getPosX()+20);
            }
        }

        getTimer(){
            return this.timer;
        }
        setTimer(timer){
            this.timer = timer*1000;
        }
        getGameMode(){
            return this.gameMode;
        }

        /**
         * setter para cambiar las fichas
         * @param {Token} token 
         */
        setFirstToken(token){
            this.tokens[0]= token;
        }
        setSecondToken(token){
            this.tokens[1]= token;
        }

        setGamemode(gameMode){
            this.gameMode = gameMode;
        }
        getBoard(){
            return this.board;
        }
        setBoard(board){
            this.board = board;
        }

        setColumns(columns){
            this.objects[0].setColumns(columns);
        }

        setRows(rows){
            this.objects[0].setRows(rows);
        }

        /**
         * cada vez que empieza el juego, el tablero se vacia con emptyBoard
         * se asigna la ficha del jugador 1 como ficha arrastrable
         * y se asigna un setTimeout con el timer, para acabar el juego por tiempo
         */
        startGame(){
            this.objects[1] = this.tokens[0];
            this.objects[0].emptyBoard();
            this.drawAll();

            this.timerId = setTimeout(() => {
                this.removeToken();
                document.getElementById("texto").innerHTML = 'Tiempo fuera!!!, presiona reset para volver a empezar';
                this.drawAll();
                //tiempo fuera
            }, this.timer);
        }

        reset(){
            /**
             * en cada reset, se cancela el setTimeout del timer, y comienza otro juego
             */
            clearTimeout(this.timerId);
            this.startGame();
        }

        getTokens(){
            const copyTokens = [];
            for (let i = 0; i < this.tokens.length; i++) {
                copyTokens.push(this.tokens[i]);
            }
            return copyTokens;
        }
        getToken(i){
            return this.tokens[i];
        }

        /**
         * con esta funcion, se hace el cambio de jugador cada vez que se coloca una ficha en el tablero exitosamente
         */
        swapTokens(){
            if(this.objects[1] == this.tokens[0]){
                this.objects[1] = this.tokens[1];
            }else{
                this.objects[1] = this.tokens[0];
            }
        }

        /**
         * aqui el juego comprueba si la ficha fue soltada sobre la parte superior del tablero
         * @returns true o false
         */
        isTokenSettedTop(){
            if(this.objects[1] != null){
                if((this.objects[1].getPosX() > this.objects[0].getPosX()) && ( this.objects[1].getPosX() <= this.objects[0].getPosX() + this.objects[0].getWidth()) &&
                (this.objects[1].getPosY() <= this.objects[0].getPosY()+100) && (this.objects[1].getPosY() > this.objects[0].getPosY() - 60)){
                    return true;
                }else{
                    return false;
                }
            }
            return false;
        }

        /**
         * con esta funcion, el juego puede reconocer en que parte del tablero fue soltada la ficha
         * @returns number
         */
        obtainTokenColumn(){
            for (let i = 1; i < this.objects[0].getColumns() + 1; i++) {
                /**
                 * en este if se consulta si la posX de la ficha es menor a el tamaño de cada azulejo multiplicado por la iteracion
                 * (la iteracion empeiza desde el 1 asi que jamas se multiplica por cero)
                 * por ejemplo, si esta en la primer columna, la pos X de la ficha debe estar entre el posX del tablero
                 * y la posX de el tablero sumado a el tamaño de 1 azulejo
                 */
                if (this.objects[1].getPosX() < (this.objects[0].getSizePerTile() * i) + this.objects[0].getPosX()) {
                    /**
                     * restamos 1 al resultado, por que anteriormente le habiamos sumado 1, para que den bien los resultados
                     * ya que las iteraciones son a partir de 0 normalmente, pero en este caso necesitaba que se a partir de 1
                     */
                    return i-1;
                }
            }
            return -100;
        }

        /**
         * en esta funcion, el juego colocara una ficha en el tablero y hara el cambio de fichas, 
         * si la ficha no puede ser colocada no se hace el cambio
         * @returns no hay retorno, use el return como "break"
         */
        setTokenOnBoard(){
            /**
             * recordemos que set token devuelve la poscicion de la fila en la que cayo la ficha, o null si no se puedo colocar
             */
            let tokenRow = this.objects[0].setToken(this.obtainTokenColumn(),this.objects[1].getFill(),this.objects[1].getImgUrl());
            /**
             * consultamos si el valor de tokenRow es null, si no es null, significa que si se coloco la ficha, 
             * por lo que se procede a consultar si hubo ganador, si hubo ganador
             * sera anunciado en el texto a la izquierda del canva, se quitara la ficha arrastrable y se quitara el settimeout
             * si no hubo ganador solo se cambia las fichas de los jugadores
             */
            if(tokenRow != null){
                if(this.objects[0].checkWin(tokenRow,this.obtainTokenColumn(),this.getGameMode())){
                    let ganador = this.objects[1].fill;
                    setTimeout(() => {
                        document.getElementById("texto").innerHTML = 'Gano: '+ganador+" presiona reset para volver a comenzar";
                    }, 1000);
                    this.removeToken();
                    clearTimeout(this.timerId);
                    this.drawAll();

                    return;
                }
                this.swapTokens();
                
            };
            this.setTokenLocation(150,500);
            this.drawAll();
        }

        /**
         * solo removemos la ficha cuando se termina el juego
         */
        removeToken(){
            this.objects[1] = null;
        }

        getObjects(){
            const copyObjets = [];
            for (let i = 0; i < this.objects.length; i++) {
                copyObjets.push(this.objects[i]);
            }
            return copyObjets;
        }
        getObject(i){
            return this.objects[i];
        }

        /**
         * esta funcion es usada para setear "manualmente" por el juego la ficha, unicamente se ha estado seteando en 
         * "la zona de reparticion de fichas" (debajo de los grupitos de fichas)
         * 
         * @param {number} x posX
         * @param {number} y posY 
         */
        setTokenLocation(x,y){
            this.objects[1].setPosX(x);
            this.objects[1].setPosY(y);
        }
        getTokenLocation(){
            if(this.objects[1]!=null){
                return [this.objects[1].getPosX(),this.objects[1].getPosY()];
            }
            return null;
        }
        getTokenRadius(){
            return this.objects[1].getRadius();
        }
        getToken(){
            return this.objects[1];
        }
    }


    /**
     * aqui se asigna variables al canva y el contexto
     */
    let canva = document.querySelector("#canva");
    let ctx = canva.getContext('2d');
    
    /**
     * en esta parte instanciamos un tablero, 2 fichas, y el juego
     */
    let tablero = new Board(250,0,90,7,6,"rgba(0,0,255,255)",ctx);
    let fichita = new Token(150, 500, "red", ctx, 35,"redToken.png");
    let fichita2 = new Token(150, 500, "green", ctx, 35,"greenToken.png");
    let juego = new Game(tablero,fichita,fichita2,ctx);
    juego.startGame();


    
    /**
     * antes de dibujar todo, se espera 1 seg para que cargen las imagenes.
     */
    setTimeout(() => {
        juego.startGame();
    }, 1000);



    /**
     * Esta parte del codigo se asigna addEventListener a diferentes partes del html
     * en este caso asignamos "mousedown" para ver si el jugador esta tomando una ficha
     */
    let selectedToken = null;
    canva.addEventListener("mousedown",function(e){
        /**
         * primero pongo ese if, por que esta la posibilidad de que la ficha no exista (cuando el juego haya terminado)
         * si el juego no ha terminado, entonces existe una ficha para arrastrar, asi que se procede a ver si 
         * el jugador clickeo una ficha
         */
        if(juego.getTokenLocation() != null){
            let posXFicha = juego.getTokenLocation()[0];
            let posYFicha = juego.getTokenLocation()[1];
            let radius = juego.getTokenRadius();
            /**
             * aqui es donde nos fijamos si el jugador clickeo alguna ficha
             * posXFicha -> posicion X de la ficha
             * e.offsetX -> posicion X de el click
             */
            if (posXFicha - radius < e.offsetX && (posXFicha + (radius*2)) > e.offsetX &&
            posYFicha - radius < e.offsetY && (posYFicha + (radius*2)) > e.offsetY  ) {
                /**
                 * esta parte del inicioX e inicioY, son calculos hechos para que 
                 * la ficha no se "arrastre" hasta donde esta apuntando el mouse, si no 
                 * que sea arrastrada desde donde se clickeo, es un poco dificil explicar esta parte por escrito,
                 * pero digamos que en resumen, si quitamos "inicioX, inicioY" cuando clickeamos una ficha, esta
                 * se dibuja empezando desde donde se hizo click.
                 */
                inicioX = e.offsetX - posXFicha;
                inicioY = e.offsetY - posYFicha;
                selectedToken = juego.getToken();
            }
        }
    });    

    /**
     * evento para ir dibujando la ficha a medida que se va moviendo el mouse (sin levantar el click obviamente)
     */
    canva.addEventListener("mousemove",function(e){
        if (selectedToken != null) {
            juego.setTokenLocation(e.offsetX - inicioX,e.offsetY - inicioY);
            juego.drawAll();
        }
    });

    /**
     * evento para soltar 
     * tambien sirve para que el juego detecte si la ficha fue colocada en la parte superior del tablero
     * de ser asi, el juego coloca la ficha en el tablero
     */
    canva.addEventListener('mouseup', function(e){
        selectedToken = null;
        if(juego.isTokenSettedTop()){
            juego.setTokenOnBoard();
        }
    });

    /**
     * si la ficha se sale del canva, la soltamos, y no se comprueba si coloco la ficha por que pudo ser por accidente.
     */
    canva.addEventListener('mouseout', function(){
        selectedToken = null;
    });

    /**
     * estos son los botones de el nav.
     */
    let btnReset = document.getElementById("btnReset");
    let btn3enRaya = document.getElementById("btn3enRaya");
    let btn4enRaya = document.getElementById("btn4enRaya");
    let btn5enRaya = document.getElementById("btn5enRaya");
    let btn6enRaya = document.getElementById("btn6enRaya");

    /**
     * evento para resetear el juego
     */
    btnReset.addEventListener("click",()=>{
        juego.reset();
    });
    /**
     * eventos para cambiar el tamaño del tablero
     */
    btn3enRaya.addEventListener("click",()=>{
        juego.setGamemode(3);
        juego.setColumns(6);
        juego.setRows(5);
        juego.reset();
    });
    btn4enRaya.addEventListener("click",()=>{
        juego.setGamemode(4);
        juego.setColumns(7);
        juego.setRows(6);
        juego.reset();
    });
    btn5enRaya.addEventListener("click",()=>{
        juego.setGamemode(5);
        juego.setColumns(8);
        juego.setRows(7);
        juego.reset();
    });
    btn6enRaya.addEventListener("click",()=>{
        juego.setGamemode(6);
        juego.setColumns(9);
        juego.setRows(8);
        juego.reset();
    });

    /**
     * botones para elegir las fichas, jugador 1
     */
    let btnRedToken = document.getElementById("redToken");
    let btnPinkToken = document.getElementById("pinkToken");
    let btnBlueToken = document.getElementById("blueToken");

    /**
     * botones para elegir las fichas, jugador 2
     */
    let btnGreenToken = document.getElementById("greenToken");
    let btnYellowToken = document.getElementById("yellowToken");
    let btnBlackToken = document.getElementById("blackToken");

    /**
     * eventos para cambiar las fichas en el juego, jugador 1
     */
    btnRedToken.addEventListener("click",()=>{
        let redToken = new Token(150,500,"red",ctx,35,"redToken.png");
        juego.setFirstToken(redToken);
        juego.reset();
    });
    btnPinkToken.addEventListener("click",()=>{
        let pinkToken = new Token(150,500,"pink",ctx,35,"pinkToken.png");
        juego.setFirstToken(pinkToken);
        juego.reset();
    });
    btnBlueToken.addEventListener("click",()=>{
        let blueToken = new Token(150,500,"blue",ctx,35,"blueToken.png");
        juego.setFirstToken(blueToken);
        juego.reset();
    });

    /**
     * eventos para cambiar las fichas en el juego, jugador 2
     */
    btnGreenToken.addEventListener("click",()=>{
        let greenToken = new Token(150,500,"green",ctx,35,"greenToken.png");
        juego.setSecondToken(greenToken);
        juego.reset();
    });
    btnYellowToken.addEventListener("click",()=>{
        let yellowToken = new Token(150,500,"yellow",ctx,35,"yellowToken.png");
        juego.setSecondToken(yellowToken);
        juego.reset();
    });
    btnBlackToken.addEventListener("click",()=>{
        let blackToken = new Token(150,500,"black",ctx,35,"blackToken.png");
        juego.setSecondToken(blackToken);
        juego.reset();
    });

    /**
     * input para el timer, por defecto es 500 segs
     */
    let inputTimer = document.getElementById("inputTimer");
    inputTimer.addEventListener("change", ()=>{
        juego.setTimer(inputTimer.value);
        juego.reset();
    });
});
