
document.addEventListener("DOMContentLoaded",function(){
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


    /**
     * funcion para ir dibujando el canva cada ves que sufra algun cambio
     */
    function drawAll() {
        ctx.fillStyle = "green";
        ctx.fillRect(0,0,canva.width,canva.height);
        for (let i = 0; i < objetos.length; i++) {
            objetos[i].draw();
        }
    }

    let canva = document.querySelector("#canva");
    let ctx = canva.getContext("2d");
    const objetos = [];
    let objetoClickeado = null;
    let inicioX = 0, inicioY = 0;    
    
    objetos.push(new Token(100,100,"red",ctx,50,'bolita.png'));
    objetos.push(new Token(100,500,'yellow',ctx,50,"iconPokemon.png"));
    drawAll()
    canva.addEventListener("mousedown",function(e){
        for (let i = 0; i < objetos.length; i++) {
            if (objetos[i].posX - objetos[i].radius < e.offsetX && (objetos[i].posX + (objetos[i].radius*2)) > e.offsetX &&
            objetos[i].posY - objetos[i].radius < e.offsetY && (objetos[i].posY + (objetos[i].radius*2)) > e.offsetY  ) {
                objetoClickeado = objetos[i];
                inicioX = e.offsetX - objetos[i].posX;
                inicioY = e.offsetY - objetos[i].posY;
                objetos.push(objetos.splice(i, 1)[0]);
                break;
            }
        }
    });

    canva.addEventListener("mousemove",function(e){
        if (objetoClickeado != null) {
            objetoClickeado.posX = e.offsetX - inicioX;
            objetoClickeado.posY = e.offsetY - inicioY;
            drawAll();
        }
    });

    canva.addEventListener('mouseup', function(){
        objetoClickeado = null;
    });
    canva.addEventListener('mouseout', function(){
        objetoClickeado = null;
    });



    
    setTimeout(() => {
        drawAll();
    }, 100);
});