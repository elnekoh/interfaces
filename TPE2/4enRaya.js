document.addEventListener("DOMContentLoaded", () =>{
    
    //declaracion de clases
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

    class Token extends Circle{
        constructor(posX, posY, fill, context, radius){
            super(posX, posY, fill, context,radius);
        }

        draw(){
            super.draw();
            let thumbImg = document.createElement('img');

            thumbImg.src = this.imgUrl;
            thumbImg.onload = this.loadImg(this.context,thumbImg);
        }

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

        emptyBoard(){
            for (let i = 0; i < this.getRows(); i++) {
                this.placedTokens[i] = [];
                for (let j = 0; j < this.getColumns(); j++) {
                    this.placedTokens[i][j] = this.defaultColorToken;
                }
            }
        }

        setToken(pos, color){
            for (let i = this.getRows()-1; i >= 0; i--) {
                if (this.placedTokens[i][pos] == this.defaultColorToken){
                    this.placedTokens[i][pos] = color;
                    return i;
                }
            }
            return null;
        }

        checkWin(x,y){
            if (this.checkHorizontal(x,y) || this.checkVertical(x,y) || this.checkDiagonalLeft(x,y) || this.checkDiagonalRight(x,y)) {
                return true;
            }else{
                return false;
            }
        }
        //f filas
        //c columnas
        checkVertical(f,c){
            let initialPos = this.placedTokens[f][c];
            let actualToken = null;
            for (let i = 0; i <= 3; i++) {
                if(f+i < this.getRows()){
                    actualToken = this.placedTokens[f+i][c];
                }
                if(actualToken != initialPos){
                    return false;
                }
                actualToken = null;
            }
            return true;
        }
        checkHorizontal(f,c){
            let initialPos =this.placedTokens[f][c];
            let actualToken = null;
            while (c-1 >= 0 && this.placedTokens[f][c-1] == initialPos) {
                initialPos = this.placedTokens[f][c-1];
                c--;
            }
            for (let i = 0; i <= 3; i++) {
                if(c+i < this.getColumns()){
                    actualToken = this.placedTokens[f][c+i];
                }
                if(actualToken != initialPos){
                    return false;
                }
                actualToken = null;
            }
            return true;
        }
        checkDiagonalLeft(f,c){
            let initialPos =this.placedTokens[f][c];
            let actualToken = null;
            while (f-1 >= 0 && c-1 >= 0 && this.placedTokens[f-1][c-1] == initialPos) {
                initialPos = this.placedTokens[f-1][c-1];
                f--;
                c--;
            }
            for (let i = 0; i <= 3; i++) {
                if(f+i < this.getRows() && c+i < this.getColumns()){
                    actualToken = this.placedTokens[f+i][c+i];
                }
                if(actualToken != initialPos){
                    return false;
                }
                actualToken = null;
            }
            return true;
        }

        checkDiagonalRight(f,c){
            let initialPos =this.placedTokens[f][c];
            let actualToken = null;
            while (f-1 >= 0 && c+1 >= 0 && this.placedTokens[f-1][c+1] == initialPos) {
                initialPos = this.placedTokens[f-1][c+1];
                f--;
                c++;
            }
            for (let i = 0; i <= 3; i++) {
                if(f+i < this.getRows() && c-i < this.getColumns()){
                    actualToken = this.placedTokens[f+i][c-i];
                }
                if(actualToken != initialPos){
                    return false;
                }
                actualToken = null;
            }
            return true;
        }

        draw(){
            const circles = [];
            const tiles = [];
            const tileModel = new Square(this.getPosX(),this.getPosY(),this.getFill(),ctx,this.getSizePerTile());

            //i  filas
            //j  columnas
            for (let i = 0; i < this.getRows(); i++) {
                tiles[i] = [];
                circles[i] = [];
                for (let j = 0; j < this.getColumns(); j++) {
                    tiles[i][j] = new Square(this.getPosX()+tileModel.getSize()*j,this.getPosY()+tileModel.getSize()*i,this.getFill(),this.context,tileModel.getSize());
                    circles[i][j] = new Token(tiles[i][j].getPosX()+ tiles[i][j].getSize()/2,tiles[i][j].getPosY()+ tiles[i][j].getSize()/2,this.placedTokens[i][j],this.context,tiles[i][j].getSize()*.39);
                    tiles[i][j].draw();
                    circles[i][j].draw();
                }
            }
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
        }

        drawAll(){
            this.context.fillStyle = "white";
            this.context.fillRect(0,0,canva.width,canva.height);
            for (let i = 0; i < this.objects.length; i++) {
                if(this.objects[i] != null){
                    this.objects[i].draw();
                }
            }
        }

        getBoard(){
            return this.board;
        }
        setBoard(board){
            this.board = board;
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
        swapTokens(){
            if(this.objects[1] == this.tokens[0]){
                this.objects[1] = this.tokens[1];
            }else{
                this.objects[1] = this.tokens[0];
            }
        }

        isTokenSettedTop(){
            if(this.objects[1] != null){
                if((this.objects[1].getPosX() > this.objects[0].getPosX()) && ( this.objects[1].getPosX() <= this.objects[0].getPosX() + this.objects[0].getWidth()) &&
                (this.objects[1].getPosY() <= this.objects[0].getPosY()+40) && (this.objects[1].getPosY() > this.objects[0].getPosY() - 60)){
                    return true;
                }else{
                    return false;
                }
            }
            return false;
        }

        obtainTokenColumn(){
            for (let i = 1; i < this.objects[0].getColumns() + 1; i++) {
                if (this.objects[1].getPosX() < (this.objects[0].getSizePerTile() * i) + this.objects[0].getPosX()) {
                    return i-1;
                }
            }
            return -100;
        }

        setTokenOnBoard(){
            let tokenRow = this.objects[0].setToken(this.obtainTokenColumn(),this.objects[1].getFill());
            if(tokenRow != null){
                if(this.objects[0].checkWin(tokenRow,this.obtainTokenColumn())){
                    //anunciarGanador
                    console.log("gano")
                    this.removeToken();
                    this.drawAll();
                    return;
                }
                this.swapTokens();
                
            };
            this.setTokenLocation(800,100);
            this.drawAll();
        }

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


    let canva = document.querySelector("#canva");
    let ctx = canva.getContext('2d');
    
    let tablero = new Board(100,80,90,7,6,"rgba(0,0,255,255)",ctx);
    let fichita = new Token(900, 100, "red", ctx, 35);
    let fichita2 = new Token(900, 100, "yellow", ctx, 35);
    let juego = new Game(tablero,fichita,fichita2,ctx);
    juego.drawAll();





    let selectedToken = null;
    canva.addEventListener("mousedown",function(e){
        if(juego.getTokenLocation() != null){
            let posXFicha = juego.getTokenLocation()[0];
            let posYFicha = juego.getTokenLocation()[1];
            let radius = juego.getTokenRadius();
            if (posXFicha - radius < e.offsetX && (posXFicha + (radius*2)) > e.offsetX &&
            posYFicha - radius < e.offsetY && (posYFicha + (radius*2)) > e.offsetY  ) {
                inicioX = e.offsetX - posXFicha;
                inicioY = e.offsetY - posYFicha;
                selectedToken = juego.getToken();
            }
        }
    });    

    canva.addEventListener("mousemove",function(e){
        if (selectedToken != null) {
            juego.setTokenLocation(e.offsetX - inicioX,e.offsetY - inicioY);
            juego.drawAll();
        }
    });

    canva.addEventListener('mouseup', function(e){
        selectedToken = null;
        if(juego.isTokenSettedTop()){
            juego.setTokenOnBoard();
        }
        //comprobar si llego esta colocada en el tablero
    });
    canva.addEventListener('mouseout', function(){
        selectedToken = null;
        //comprobar si llego esta colocada en el tablero
    });
});
