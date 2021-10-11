document.addEventListener("DOMContentLoaded",function(){

    class Board {
        constructor(posX,posY,tamanioPorCuadro, columns, rows, fill,ctx){
            this.posX = posX;
            this.posY = posY;
            this.tamanioPorCuadro = tamanioPorCuadro;
            this.rows = rows;
            this.columns = columns;
            this.fill = fill;
            this.defaultColorToken = "rgba(100,100,255,255)"//hacer una ficha negra jeje
            this.fichasColocadas =[];
            this.ctx = ctx;

            for (let i = 0; i < rows; i++) {
                this.fichasColocadas[i] = [];
                for (let j = 0; j < columns; j++) {
                    this.fichasColocadas[i][j] = {
                        "fill" : this.defaultColorToken,
                        "imgUrl": ""
                    };
                }
            }
        }

        /*
        //primer valor filas
        //segundo valor columnas
        setFicha(pos,color){
            this.fichasColocadas[pos[0]][pos[1]] = color;
        }
        */

        setFicha(pos, color,imgUrl){
            if(imgUrl == undefined || imgUrl == null){
                imgUrl = "";
            }
            for (let i = this.getRows()-1; i >= 0; i--) {
                if (this.fichasColocadas[i][pos].color == this.defaultColorToken){
                    this.fichasColocadas[i][pos].color = color;
                    this.fichasColocadas[i][pos].imgUrl =imgUrl; 
                    break;
                }
                //comprobarSiGano();
            }
        }

        getFill(){
            return this.fill;
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

        getTamanioPorCuadro(){
            return this.tamanioPorCuadro;
        }

        getPosX(){
            return this.posX;
        }
        
        getPosY(){
            return this.posY;
        }

        getFill(){
            return this.fill;
        }


        draw(){
            let circulos = [];
            const cuadradoPrueba = new Square(this.getPosX(),this.getPosY(),"rgba(0,0,255,255)",ctx,this.getTamanioPorCuadro());
            cuadradoPrueba.draw();
            let cuadrados = [];

            //i  filas
            //j  columnas
            for (let i = 0; i < this.rows; i++) {
                cuadrados[i] = [];
                circulos[i] = [];
                for (let j = 0; j < this.columns; j++) {
                    cuadrados[i][j] = new Square(cuadradoPrueba.getPosX() + cuadradoPrueba.getSize()*j,cuadradoPrueba.getPosY() + cuadradoPrueba.getSize()*i,this.getFill(),ctx,cuadradoPrueba.getSize());
                    circulos[i][j] = new Token(cuadrados[i][j].getPosX()+ cuadrados[i][j].getSize()/2,cuadrados[i][j].getPosY()+ cuadrados[i][j].getSize()/2,this.fichasColocadas[i][j].fill,ctx,cuadrados[i][j].getSize()*.39,this.fichasColocadas[i][j].imgUrl);
                    cuadrados[i][j].draw();
                    circulos[i][j].draw();
                }
            }
            this.ctx.beginPath();
            this.ctx.rect(this.posX, this.posY,this.getTamanioPorCuadro()*this.columns,this.getTamanioPorCuadro()*this.rows);
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = "round";
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
            this.ctx.closePath();
        }
        
    }

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
    
        getPosY(){
            return this.posY;
        }
    
        getFill(){
            return this.fill;
        }
    
        draw(){
            this.context.fillStyle = this.fill;
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
            this.context.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI);
            this.context.fill();
            this.context.closePath();
            this.context.beginPath();
            this.context.arc(this.posX, this.posY, this.radius, 0, 2*Math.PI);
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
    
    class Square extends Figure {
        constructor(posX, posY, fill, context, size){
            super(posX, posY, fill, context);
            this.size = size;
        }

        draw(){
            super.draw();
            this.context.beginPath();
            this.context.rect(this.posX, this.posY, this.getSize(),this.getSize());
            this.context.fill();
            this.context.closePath();
            
        }
        
        getSize(){
            return this.size;
        }
    }

    class Token extends Circle{
        constructor(posX, posY, fill, context, radius, imgUrl){
            super(posX, posY, fill, context, radius);
            this.imgUrl = imgUrl;
        }

        draw(){
            super.draw();
            let thumbImg = document.createElement('img');

            thumbImg.src = this.imgUrl;
            thumbImg.onload = this.cargarImagen(this.context,thumbImg);
        }

        cargarImagen(c,img){
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












    let canva = document.querySelector("#canva");
    let ctx = canva.getContext("2d");

    /*
    let cuadrado1 = new Square(1,3,"rgba(0,0,255,255)",ctx,80);
    let circle = new Circle(cuadrado1.getPosX()+ cuadrado1.getSize()/2,cuadrado1.getPosY()+ cuadrado1.getSize()/2,"rgba(100,100,255,255)",ctx,cuadrado1.getSize()*.39);

    let cuadrado2 = new Square(cuadrado1.getPosX()+cuadrado1.getSize(),cuadrado1.getPosY(),"rgba(0,0,255,255)",ctx,80);
    let circle2 = new Circle(cuadrado2.getPosX()+ cuadrado2.getSize()/2,cuadrado2.getPosY()+ cuadrado2.getSize()/2,"rgba(100,100,255,255)",ctx,cuadrado2.getSize()*.39);

    let cuadrado3 = new Square(cuadrado1.getPosX()+cuadrado1.getSize()*2,cuadrado1.getPosY(),"rgba(0,0,255,255)",ctx,80);
    let circle3 = new Circle(cuadrado3.getPosX()+ cuadrado3.getSize()/2,cuadrado3.getPosY()+ cuadrado3.getSize()/2,"rgba(100,100,255,255)",ctx,cuadrado3.getSize()*.39);
    
    cuadrado1.draw();
    cuadrado2.draw();
    cuadrado3.draw();
    circle.draw();
    circle2.draw();
    circle3.draw();
*/
    const tablero = new Board(0,0,90,7,6,"blue",ctx);
    tablero.draw();
    tablero.setFicha(5,"yellow",'pokemonIcon.png');
    tablero.setFicha(2,"red",'bolita.png');
    tablero.setFicha(2,"yellow",'pokemonIcon.png');
    tablero.setFicha(2,"red",'bolita.png');
    tablero.setFicha(0,"yellow",'pokemonIcon.png');

    const fichas = [];
    fichas.push(new Token(900, 100, "red", ctx, 35,'bolita.png'));
    fichas.push(new Token(900, 100, "yellow", ctx, 35,'pokemonIcon.png'));

    const objetos = [];
    objetos.push(tablero);
    objetos.push(fichas[0]);

    let fichaSeleccionada = null;
    function drawAll() {
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canva.width,canva.height);
        for (let i = 0; i < objetos.length; i++) {
            objetos[i].draw();
        }
    }

    canva.addEventListener("mousedown",function(e){
        if (objetos[1].posX - objetos[1].radius < e.offsetX && (objetos[1].posX + (objetos[1].radius*2)) > e.offsetX &&
        objetos[1].posY - objetos[1].radius < e.offsetY && (objetos[1].posY + (objetos[1].radius*2)) > e.offsetY  ) {
            inicioX = e.offsetX - objetos[1].posX;
            inicioY = e.offsetY - objetos[1].posY;
            fichaSeleccionada = objetos[1];
        }
    });    

    canva.addEventListener("mousemove",function(e){
        if (fichaSeleccionada != null) {
            fichaSeleccionada.posX = e.offsetX - inicioX;
            fichaSeleccionada.posY = e.offsetY - inicioY;
            drawAll();
        }
    });

    canva.addEventListener('mouseup', function(){
        fichaSeleccionada = null;
    });
    canva.addEventListener('mouseout', function(){
        fichaSeleccionada = null;
    });
    
    setTimeout(() => {
        drawAll();
    }, 500);
});
