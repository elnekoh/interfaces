
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


    /**
     * funcion para ir dibujando el canva cada ves que sufra algun cambio
     */
    function drawAll() {
        ctx.fillStyle = "white";
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
    
    objetos.push(new Circle (100, 500, "blue", ctx, 40));
    objetos.push(new Circle (500, 800, "red", ctx, 100));
    objetos.push(new Circle (700, 260, "green", ctx, 70));
    objetos.push(new Circle (400, 300, "pink", ctx, 200));
    drawAll();

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
});