document.addEventListener('DOMContentLoaded', function(){
    class Animation{
        constructor(posX,posY,width,height,url){
            this.posX = posX;
            this.posY = posY;
            this.width = width;
            this.height = height;
            this.url = url;
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

        getWidth(){
            return this.width;
        }
        setWidth(width){
            this.width = width;
        }

        getHeight(){
            return this.height
        }
        setHeight(height){
            this.height = height;
        }

        getUrl(){
            return this.url;
        }
        setUrl(url){
            this.url = url;
        }
    }

    let existeOcti = false;
    let existeToken = false;
    class Token extends Animation{
        constructor(posX,posY,width,height,url){
            super(posX,posY,width,height,url);
        }

        spawnToken(){
            existeToken = true;
            let divToken = document.createElement("div");
            divToken.setAttribute("id","token");
            document.getElementById("container").insertAdjacentElement("beforeend",divToken);
            divToken.style.transform = `translate(${this.posX}px,${Math.floor(Math.random() * ((420+1)-270)+270)}px)`
            divToken.style.animation = `token 4s linear`
            divToken.style.backgroundImage = this.url;
            return divToken;
        }
    }
    let isMoving = true;
    class Background extends Animation{
        constructor(posX,posY,width,height,url,time){
            super(posX,posY,width,height,url);
            this.time = time;
        }

        moveBg(){
            let animation = "";
            let container = document.getElementById("container");
            let divBg = document.createElement("div");
            divBg.setAttribute("class",`bg`);
            document.getElementById("container").insertAdjacentElement("beforeend",divBg);
            console.log(this.time)
            if(isMoving){
                animation = `movebg ${this.time}s linear infinite`;
            }else{
                animation = `movebg 0s linear infinite`;
            }
            console.log(animation)
            divBg.style.backgroundImage = this.url;
            divBg.style.animation = animation;
        }
    }

    class Octi extends Animation{
        constructor(posX,posY,width,height,url){
            super(posX,posY,width,height,url);
        }

        spawmCreature(){
            existeOcti = true;
            let time = 2.5;
            let divOcti = document.createElement("div");
            divOcti.setAttribute("id","octi");
            document.getElementById("container").insertAdjacentElement("beforeend",divOcti);
            divOcti.style.transform = `translate(${this.posX}px,${this.posY}px)`
            divOcti.style.animation = `octi ${time}s steps(7) infinite`
            divOcti.style.backgroundImage = this.url;
            return divOcti;
        }
    }
    class Jugador extends Animation{
        constructor(posX,posY,width,height,url){
            super(posX,posY,width,height,url);
            this.isOnAir =false;
        }

        createPlayer(){
            let divPlayer = document.createElement("div");
            divPlayer.setAttribute("id","player"); 
            document.getElementById("container").insertAdjacentElement("beforeend",divPlayer);
            divPlayer.style.transform = `translate(${this.posX}px,${this.posY}px)`
        }

        run(){
            this.isOnAir = false;
            let divPlayer = document.getElementById("player");
            divPlayer.style.transform = `translate(${this.posX}px,${this.posY}px)`
            divPlayer.style.animation = "walk .8s steps(6) infinite";
            divPlayer.style.backgroundImage = this.url;
        }

        jump(){
            if(!this.isOnAir){
                this.isOnAir = true;
                let divPlayer = document.getElementById("player");
                divPlayer.style.transform = `translate(${this.posX}px,${this.posY}px)`
                divPlayer.style.animation = "jump .8s steps(5) infinite";
                divPlayer.style.backgroundImage = this.url;
                setTimeout(() => {
                    this.run(); 
                }, 800);
            }
        }
    }

    let bg1 = new Background(0,0,600,800,"url(/TPE3/1/rezize/1.png)",30);
    let bg2 = new Background(0,0,600,800,"url(/TPE3/1/rezize/2.png)",20);
    let bg3 = new Background(0,0,600,800,"url(/TPE3/1/rezize/3.png)",16);
    let bg4 = new Background(0,0,600,800,"url(/TPE3/1/rezize/4.png)",9);
    let bg5 = new Background(0,0,600,800,"url(/TPE3/1/rezize/5.png)",9);
    bg1.moveBg();
    bg2.moveBg();
    bg3.moveBg();
    bg4.moveBg();
    bg5.moveBg();
    let jugador = new Jugador(100,460,35,51,"url(/TPE3/pruebas/charactersTira.png)");
    jugador.createPlayer();
    jugador.run();
    let octi = new Octi(640,460,64,51,"url(/TPE3/octi.png)")
    let token = new Token(600,460,256,256, "url(/TPE3/token.png)");

    setInterval(() => {
        let divOcti = octi.spawmCreature();
        setTimeout(() => {
            document.getElementById("container").removeChild(divOcti);
            existeOcti = false
        }, 2500);
    }, 5000);
    setInterval(() => {
        let divToken = token.spawnToken();
        setTimeout(() => {
            if(existeToken){
                document.getElementById("container").removeChild(divToken);
                existeToken = false
            }
        }, 4000);
    }, 6500);

    document.getElementById("container").addEventListener("click",()=>{
        jugador.jump();
    });

    function checkCollision(div1, div2) {
        var div1Rect = div1.getBoundingClientRect();
        var div2Rect = div2.getBoundingClientRect();
      
        return (div1Rect.right >= div2Rect.left &&
            div1Rect.left <= div2Rect.right) &&
          (div1Rect.bottom >= div2Rect.top &&
            div1Rect.top <= div2Rect.bottom);
      }
    
    let contador = 0;
    let intervalId = setInterval(() => {
        if(existeOcti && checkCollision(document.getElementById("player"),document.getElementById("octi"))){
            console.log("toco")
        }
        if(existeToken && checkCollision(document.getElementById("player"),document.getElementById("token"))){
            contador++;
            console.log(contador)
            document.getElementById("container").removeChild(document.getElementById("token"));
            existeToken = false
        }
    }, 50);
});