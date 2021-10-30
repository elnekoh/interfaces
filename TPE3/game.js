/**esto fue probado en firefox, en ghpages no cargan las imagenes, aun no se porque, para que funcione bien debe utilizarse descargado */
document.addEventListener("DOMContentLoaded", ()=>{
    /**
     * esta clase es el padre de todos los objetos en este ejercicio
     * cuenta con los atributos posX y posY, que seran la posicion donde se generan por primera vez dichos objetos
     * y el atributo "url" que es el url de la imagen de fondo que tendra cada objeto
     */
    class AnimatedObject{
        constructor(posX,posY,url){
            this.posX =  posX;
            this.posY =  posY;
            this.url = url;
        }
    }
    /**
     * esta clase sirve para crear una moneda en pantalla que el jugador puede recojerla para ganar 1 punto
     * la clase token cuenta con un atributo llamado "spawnedToken", que sirve para saber si hay un token en pantalla
     * nos sirve para no intentar borrar tokens que no existen
     */
    class Token extends AnimatedObject{
        constructor(posX,posY,url){
            super(posX,posY,url);
            this.spawnedToken= false;
        }

        /**
         * esta funcion genera un token en el container
         */
        spawnToken(){
            this.spawnedToken = true; //primero cambiamos el estado de spawnedToken
            let divToken = document.createElement("div"); // crea un div
            divToken.setAttribute("id","token"); //le agrega un id llamado "token", el estilo de ldiv ya esta asignado en la hoja css
            document.getElementById("container").insertAdjacentElement("beforeend",divToken);//inserta el div en el container
            divToken.style.transform = `translate(${this.posX}px,${this.posY}px)`; //mueve el div a su punto de origen
            divToken.style.animation = `token 4s linear`; //le asigna el "keyframes" el cual tiene que estar si o si creado en la hoja css
            divToken.style.backgroundImage = this.url; //y por ultimo le pone la imagen de fondo
            return divToken; //tanto esta funcion como "spawnOcti" devuelven el div creado para agilizar la tarea para borrarlo cuando ya no sea necesario
        }

        setSpawnedToken(boolean){
            this.spawnedToken = boolean;
        }
        getSpawnedToken(){
            return this.spawnedToken;
        }
    }

    /**
     * esta clase es para crear a "Octi", el obstaculo que debera esquivar el jugador
     * cuenta con el booleano "spawnedOcti", que cumple la misma funcion que "spawnedToken"
     */
    class Octi extends AnimatedObject{
        constructor(posX,posY,url){
            super(posX,posY,url);
            this.spawnedOcti = false;
        }

        /**
         * esta funcion es igual a la de spawnToken
         */
        spawnOcti(){
            this.spawnedOcti = true;
            let divOcti = document.createElement("div");
            divOcti.setAttribute("id","octi");
            document.getElementById("container").insertAdjacentElement("beforeend",divOcti);
            divOcti.style.transform = `translate(${this.posX}px,${this.posY}px)`;
            divOcti.style.animation = `octi 2.5s steps(7) infinite`;
            divOcti.style.backgroundImage = this.url;

            return divOcti;
        }

        setSpawnedOcti(boolean){
            this.spawnedOcti = boolean;
        }
        getSpawnedOcti(){
            return this.spawnedOcti;
        }
    }

    /**
     * esta clase es para crear al jugador, y cambiar de "corriendo" a "saltando", cada vez que se llame a la funcion jump
     * cuenta con un atributo llamado "isOnAir" que se usa para controlar que el personaje no salte si ya esta en el aire
     */
    class Player extends AnimatedObject{
        constructor(posX,posY,url){
            super(posX,posY,url);
            this.isOnAir = false;
        }

        /**
         * con esta funcion se crea a el personaje que usa el jugador
         */
        spawnPlayer(){
            let divPlayer = document.createElement("div");//crea un div
            divPlayer.setAttribute("id","player"); //le asigna id player
            document.getElementById("container").insertAdjacentElement("beforeend",divPlayer); //introduce el div en el container
            divPlayer.style.transform = `translate(${this.posX}px,${this.posY}px)`; // mueve el personaje a el punto de origen
            divPlayer.style.backgroundImage = this.url; //y le asigna la imagen de fondo
        }

        run(){ 
            let divPlayer = document.getElementById("player");
            divPlayer.style.animation = "run .8s steps(6) infinite";//asigna la animacion de correr al personaje
        }

        jump(){
            if(!this.isOnAir){//si esta en el aire, no pasara nada
                this.isOnAir = true;//cambiamos el estado de el atributo para que el personaje no salte de nuevo si esta en el aire
                let divPlayer = document.getElementById("player");
                divPlayer.style.animation = "jump .8s steps(5) infinite";//le asigna la animacion de salto 
                setTimeout(() => {//con este setTimeOut, una vez finalizado el "salto", cambia la animacion a correr, y cambia isOnAir asi puede volver a saltar
                    this.run(); 
                    this.isOnAir = false;
                }, 800);
            }
        }
    }
    /**
     *esta clase es para crear fondos, se puede crear muchos, es importante mantener un orden, no solo con cada fondo, con cada elemento
     un fondo o un obstaculo, si primero dibujamos al jugador, y luego ponemos un fondo, el fondo tapara el jugador.
     a que se debe esto? por que cada vez que se crea un div en container,cuando lo introduzco usando "isertAdjacentElemnt" pongo "beforeend",
     lo que hace que ese elemento creado sea insertado al final de los hijos, teniendo esto en cuenta hay que ser concientes de poner
     todo en el orden que quiero que sea dibujado (primero fondos y luego otros elementos como el personaje) 
     */
    class Background extends AnimatedObject{
        constructor(posX,posY,url,time){
            super(posX,posY,url);
            this.isMoving = true;//este atributo es para decirle si el fondo debe moverse o no
            this.time = time;//y este atributo es para definir que tan rapido tiene que ser la animacion de movimiento
        }

        moveBg(){
            let animation = "";//inicio animation vacio
            let divBg = document.createElement("div");
            divBg.setAttribute("class",`bg`);
            document.getElementById("container").insertAdjacentElement("beforeend",divBg);
            //si el fondo debe moverse, entonces usara el tiempo de movimiento que tiene asignado, de lo contrario el tiempo sera 0, es decir estara quieto
            if(this.isMoving){
                animation = `movebg ${this.time}s linear infinite`;
            }else{
                animation = `movebg 0s linear infinite`;
            }
            divBg.style.backgroundImage = this.url;
            divBg.style.animation = animation;
        }

        setIsMoving(boolean){
            this.isMoving = boolean;
        }
    }

    /**
     * esta funcion es para ver si dos divs se tocan, o si uno esta "ensima" de otro,
     * lo hice con ayuda de un post en stackoverflow, que ahora mismo no puedo poner el link por que borre el historial,
     * pero si llego con el tiempo lo pondre el link mas tarde.
     * @param {HTMLDivElement} div1 
     * @param {HTMLDivElement} div2 
     * @returns 
     */
    function checkCollision(div1, div2){
        let div1Rect = div1.getBoundingClientRect();//getBoundingClientRect devuelve la ubicacion en la que el div es dibujado
        let div2Rect = div2.getBoundingClientRect();

        return (div1Rect.right >= div2Rect.left && div1Rect.left <= div2Rect.right) && (div1Rect.bottom >= div2Rect.top && div1Rect.top <= div2Rect.bottom);
    }

    /**
     * esta funcion sera ejecutada cuando el gameloop se corte
     * lo que hace es mostrar un boton para reiniciar el juego y mostrar tambien los puntos
     * @param {number} points estos son los puntos que hizo el jugador
     */
    function gameOver(points){
        bg1.setIsMoving(false);//se cambia todos los isMoving
        bg2.setIsMoving(false);
        bg3.setIsMoving(false);
        bg4.setIsMoving(false);
        bg5.setIsMoving(false);
        bg1.moveBg();//y se vuelve a dibujar el fondo
        bg2.moveBg();
        bg3.moveBg();
        bg4.moveBg();
        bg5.moveBg();
        let divGameOver = document.createElement("div");//crea un div para la imagen de gameover
        divGameOver.setAttribute("id","gameOver");
        document.getElementById("container").insertAdjacentElement("beforeend",divGameOver);
        divGameOver.style.backgroundImage = "url(/TPE3/gameover.png)"

        let divReset = document.createElement("div");//crea un div para el boton de reset
        divReset.setAttribute("id","btnReset");
        divReset.setAttribute("class","btn");
        document.getElementById("container").insertAdjacentElement("beforeend",divReset);
        divReset.innerHTML ="Reset";
        divReset.style.transform = "translate(500px,265px)"
        document.getElementById("btnReset").addEventListener("click",()=>{ //le asigna un evento para reiniciar le juego
            document.getElementById("container").innerHTML= ``; //se borra todo el contenido del container para luego iniciar desde 0
            startGame();
        });

        let divPoints = document.createElement("div");//crea el div para mostrar los puntos
        divPoints.setAttribute("id","points");
        divPoints.setAttribute("class","btn");
        document.getElementById("container").insertAdjacentElement("beforeend",divPoints);
        divPoints.innerHTML= `Monedas recolectadas: ${points}`;
        divPoints.style.transform = "translate(250px,195px)";
    }

    /**
     * esta funcion es para iniciar un juego, dentro tiene un gameloop
     */
    function startGame(){
        let bg1 = new Background(0,0,"url(/background/bg1.png)",30);//como mencione antes, el orden es importante, primero se crean los fondos
        let bg2 = new Background(0,0,"url(/background/bg2.png)",20);//y el orden de los fondos tambien importan, el primero tiene que ser el que esta "mas atras" y tiene que ser el mas lento
        let bg3 = new Background(0,0,"url(/background/bg3.png)",15);
        let bg4 = new Background(0,0,"url(/background/bg4.png)",9);// y el ultimo el "mas cercano", y se tiene que mover mas rapido
        let bg5 = new Background(0,0,"url(/background/bg5.png)",9);// en este caso los ultimos 2 se mueven igual por que el ante ultimo son los arboles del camino
        bg1.moveBg();//luego les decimos que se muevan, tambien se puede crear un  array de fondos para hacer esto en menos lineas de codigo
        bg2.moveBg();
        bg3.moveBg();
        bg4.moveBg();
        bg5.moveBg();
        let jugador = new Player(100,460,"url(charactersTira.png");//creamos un objeto de la clase player
        jugador.spawnPlayer();//spawneamos al jugador
        jugador.run();//hacemos que inicie su animacion de "correr"
        let octi = new Octi(640,460,"url(octi.png)")//instanciamos las clases octi y token
        let token = new Token(600,460, "url(token.png)");

        let points = 0;//iniciamos los puntos en 0

        //iniciamos 2 intervals para token y octi, asi se van generando de a poco.
        let intervalOcti = setInterval(() => {
            let divOcti = octi.spawnOcti();
            //este settimeout es para borrar el div de octi cuando haya terminado su recorrido
            setTimeout(() => {
                document.getElementById("container").removeChild(divOcti);
                octi.setSpawnedOcti(false);
            }, 2500);// 2,5 segs, este es el tiempo que dura el recorrido de octi, se deberia cambiar esto por una variable asi no estaria tan hardcodeado
        }, 5000);

        //este interval funciona igual que el interval de octi
        let intervalToken = setInterval(() => {
            let divToken = token.spawnToken();
            setTimeout(() => {
                if(token.spawnedToken){
                    document.getElementById("container").removeChild(divToken);
                    token.setSpawnedToken(false);
                }
            }, 4000);
        }, 6500);

        //este es el famosisimo gameloop
        let intervalGame = setInterval(() => {
            //cada interacion del gameloop, se checkea si el jugador colisiono con octi, de ser asi 
            if(octi.getSpawnedOcti() && checkCollision(document.getElementById("player"),document.getElementById("octi"))){
                //si el juegador toco a octi cortamos la generacion de octis, de tokens y las iteraciones de este mismo interval
                clearInterval(intervalGame);
                clearInterval(intervalOcti);
                clearInterval(intervalToken);
                //y se llama al a funcion que nos muestra el game over ademas de el boton de reinicio y los puntos
                gameOver(points);
            }
            //tambien en cada iteracion se comprueba si el jugador toco una moneda
            if(token.getSpawnedToken() && checkCollision(document.getElementById("player"),document.getElementById("token"))){
                points++; // si toco una moneda, se le da un punto
                document.getElementById("container").removeChild(document.getElementById("token"));//y quitamos la moneda.
                token.setSpawnedToken(false);
            }
            //este evento es para que el jugador pueda saltar, al hacer click en el juego, la animacion cambiao a "saltar"
            document.getElementById("container").addEventListener("click",()=>{
                jugador.jump();
            });
        }, 50);
    }
    //empieza el juego, y con el juego tambien empieza la el interval del gameloop
    startGame();
});