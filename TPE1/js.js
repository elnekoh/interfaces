/**
 * esta pagina fue testeada y funciono correctamente en firefox
 * con la ayuda de la extension de vscode "liveserver" para poder subir imagenes
 */
document.addEventListener('DOMContentLoaded', function(){ 
    //declarar canva y contexto globales

    let c = document.getElementById("canva"); 
    let context = c.getContext("2d");
    let imageData = context.getImageData(0,0,c.width,c.height); 
    
    /*pinto el canva de blanco (si no lo hago, el canva tendra el color de fondo que tenga su contenedor,
    sin mencionar que a la hora de aplicar filtros, si no el fondo no esta pontado de blanco, no lo toma)*/
    canvaBlanco();
        
    /**
    * Esta funcion sirve para pintar todo el canva de color blanco.
    */
    function canvaBlanco() {
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                setPixel(imageData,x,y,255,255,255,255);
            }
        }
        context.putImageData(imageData,0,0);
    }

    //lapiz
    const color = document.querySelector("#color");
    const tamanioLapiz = document.querySelector("#tamanioLapiz");
    color.value = "#ff0000";//color por defecto
    tamanioLapiz.value = 3;//tamaño por defecto

    //goma
    let gomaSeleccionada = false;
    const tamanioGoma = document.querySelector("#tamanioGoma");
    tamanioGoma.value = 3;//tamaño por defecto

    const divGoma = document.querySelector(".botonGoma");
    const divLapiz = document.querySelector(".botonLapiz");
    //cuando tocamos el div de la goma, el booleano "gomaSeleccionada" cambia a true.
    divGoma.addEventListener("click", function(){
        gomaSeleccionada = true;
        /**
         * cuando la goma esta sleccionada su div se oscurece, lo mismo ocurre con el lapiz
         */
        divGoma.classList.add("selected");
        divLapiz.classList.remove("selected");
    });

    /**
     * y cuando toca el div del lapiz, vuelve a cambiar a false,
     * es gracias a esto que el usuario puede elegir entre goma y lapiz.
     */
     divLapiz.addEventListener("click",function() {
        gomaSeleccionada = false
        divLapiz.classList.add("selected");
        divGoma.classList.remove("selected");
    });

    //funcionamiento lapiz/goma

    let estaDibujando = false; 
    let [ultimoX, ultimoY] = [0,0];
    c.addEventListener('mousemove',dibujar);
    c.addEventListener('mousedown', function(e){
        /**
         * ni bien empieza el trazo, actualizamos las coordenadas X e Y, 
         * de lo contrario, siempre se estaria dibujando una linea continua. 
         */
        [ultimoX, ultimoY] = [e.offsetX, e.offsetY];//ni bien empieza el trazo, se actualiza las coordenadas, para saber de donde empezar
        estaDibujando = true;
    });
    c.addEventListener('mouseup', function(){
        estaDibujando = false;
    });
    c.addEventListener('mouseout', function(){
        estaDibujando = false;
    });


    /**
     * con el booleano "estaDibujando" podremos filtrar los movimientos de mouse del usuario
     * solo se dibujaran los movimientos cuando "estaDibujando" sea true
     * en el array [ultimoX, ultimoY] se guardaran siempre las ultimas posiciones X e Y del mouse en el canva.
     * decidi que sean variables globales, asi pueden ser tomadas por el addEvenListener('mousedown') y por la funcion dibujar()
     * aprendi mucho de la siguiente pagina --> https://medium.com/@yonem9/pintando-con-el-canvas-javascript-573e4951b61a
     * 
     * @param {*} e Este es el evento recibido, de aqui conseguimos las coordenadas por donde el cursor pasa 
     */
    function dibujar(e){
        if (estaDibujando) {
            //console.log(e);
            context.beginPath();//inicio de trazo
            context.lineJoin = 'round'; // con estas dos sentencias, las lineas son redondeadas y no cuadradas.
            context.lineCap = 'round';
            context.lineWidth = tamanioLapiz.value;//valores del input
            context.strokeStyle=color.value;
            if (gomaSeleccionada) {
                context.lineWidth = tamanioGoma.value;
                context.strokeStyle="rgba(255,255,255,255)";
            }
            context.moveTo(ultimoX,ultimoY);//la linea va desde 
            context.lineTo(e.offsetX,e.offsetY);//hasta
            context.stroke();//cierre de trazo
            [ultimoX, ultimoY] = [e.offsetX, e.offsetY] //al final de la funcion, actualizamos las ultimas dos coordenadas del mouse
        }
    }    

    //funcion imagen

    /**
     * en esta parte del codigo es donde programe el input para subir una imagen.
     * es bastante simple, cuando el usuario sube la imagen, se activa el evento "change"
     * otra vez representé el evento con la variable e.
     * 
     * declaro la variable image (apunta a un objeto de la clase Image())
     * le asigno una url con la imagen que subió el usuario
     * eso lo aprendi de esta pagina --> https://www.webtrickshome.com/forum/how-to-display-uploaded-image-in-html-using-javascript
     * 
     * y luego viene la parte mas importante, que hacer con la imagen? recortarla? o achicarla?
     * en una de las clases Javier dijo que era mejor achicarla, pero a mi no me gusta mucho esa idea
     * asi que crei que asi como a mi no me gusta esa idea, a el usuario tambien podria no gustarle (o si)
     * por lo que el usuario decide esa parte.
     */
    let inputImagen = document.getElementById("inputImagen");
    inputImagen.addEventListener('change',function(e){
        let image = new Image();
        image.src = URL.createObjectURL(e.target.files[0]); 

        image.onload = function(){
            if(confirm("quiere achicar la imagen?, si responde negativamente, la imagen podria ser recortada para no perder calidad")){
                context.drawImage(this, 0, 0,c.width,c.height);
            }else{
                context.drawImage(this, 0, 0);
            }
        }
    });

    /**
     * con esta funcion se puede sacar el valor R de un pixel
     * esta funcion la saque de las clases/filminas
     * 
     * @param {*} imageData 
     * @param {number} x coordenada x
     * @param {number} y coordenada y
     * @returns 
     */
    function getRed(imageData, x, y) {
        let index = (x+ y * imageData.width) *4
        return imageData.data[index];
    }
    
    /**
     * con esta funcion se puede sacar el valor G de un pixel
     * esta funcion la saque de las clases/filminas
     * 
     * @param {*} imageData 
     * @param {number} x coordenada x
     * @param {number} y coordenada y
     * @returns 
     */
    function getGreen(imageData, x, y) {
        let index = (x+ y * imageData.width) *4
        return imageData.data[index + 1];
    }

    /**
     * con esta funcion se puede sacar el valor B de un pixel
     * esta funcion la saque de las clases/filminas
     * 
     * @param {*} imageData 
     * @param {number} x coordenada x
     * @param {number} y coordenada y
     * @returns 
     */
    function getBlue(imageData, x, y) {
        let index = (x+ y * imageData.width) *4
        return imageData.data[index + 2];
    }
    
    /**
     * Esta funcion sirve para asignar los valores RGBA a un pixel de una imageData recibida
     * 
     * 
     * @param {*} imageData 
     * @param {number} x coordenada x
     * @param {number} y coordenada y
     * @param {number} r valor que se desea poner en R
     * @param {number} g valor que se desea poner en G
     * @param {number} b valor que se desea poner en B
     * @param {number} a valor que se desea poner en A
     */
    function setPixel(imageData, x, y, r, g, b ,a) {
        let index = (x + y * imageData.height)*4;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = a;
    }

    /**
    * esta funcion la saque de stackoverflow, para poder hacer el pasaje de rgb a hsl 
    * decidi dejar su descripcion original.
    * https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    * Converts an RGB color value to HSL. Conversion formula
    * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
    * Assumes r, g, and b are contained in the set [0, 255] and
    * returns h, s, and l in the set [0, 1].
    *
    * @param   {number}  r       The red color value
    * @param   {number}  g       The green color value
    * @param   {number}  b       The blue color value
    * @return  {Array}           The HSL representation
    */
    function rgbToHsl(r, g, b){
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    /**
     * esta funcion la saque de stackoverflow, para poder hacer el pasaje de hsl a rgb  
     * decidi dejar su descripcion original.
     * https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   {number}  h       The hue
     * @param   {number}  s       The saturation
     * @param   {number}  l       The lightness
     * @return  {Array}           The RGB representation
     */
    function hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    
    /**
     * esta funcion sera llamada de un boton,
     * toma la imageData del contexto global
     * luego recorre cada para poner el valor contrario de este
     * 
     * para hacer esto pense en simplemente tomar el valor maximo (255)
     * y restarle en cada pixel sus valores RGB
     * de esta manera, si r vale 255, luego de esa operacion valdra 0
     * si valia 1, valdra 254, etc
     */
    function negativo() {
        let imageData = context.getImageData(0,0,c.width,c.height);
        let r,g,b =0;
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                r = 255 - getRed(imageData,x,y);
                g = 255 - getGreen(imageData,x,y);
                b = 255 - getBlue(imageData,x,y);
                setPixel(imageData,x,y,r,g,b,255);
            }
        }
        context.putImageData(imageData,0,0);
    }

    /**
     * esta funcion sera llamada de un boton,
     * toma la imageData del contexto global
     * luego recorre cada para poner el valor contrario de este
     * 
     * en este caso pensé, solo puede haber 2 valores en esta imagen, 0(negro) o 255(blanco)
     * lo que tenia que hacer es que en cada iteracion, se decida en base a los valores RGB si el pixel seria blanco o negro
     * entonces se me ocurrio hacer como en el ejercicio de el filtro "blanco y negro" donde para cada pixel
     * se sacaba un promedio de los valores de RGB y el resultado seria el nuevo valor para RGB en cada pixel.
     * pero esta vez sin grises, con un if que decida por cada pixel el color que tendra.
     * si supera el umbral de 127.5 (la mitad de 255) entonces significa que el gris era muy claro, 
     * por lo que el pixel tiene que ser blanco.
     * si el promedio no llega a 127.5, entonces ese gris mas oscuro, por lo cual el pixel sera negro.
     */
    function binarizacion() {
        let imageData = context.getImageData(0,0,c.width,c.height);
        let color = 0;
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                color = (getRed(imageData,x,y) + getGreen(imageData,x,y) + getBlue(imageData,x,y)) / 3;
                if(color>255/2){
                    color = 255;
                }else{
                    color = 0;
                }
                setPixel(imageData,x,y,color,color,color,255);
            }
        }
        context.putImageData(imageData,0,0);
    }

   /**
     * esta funcion sera llamada de un boton,
     * toma la imageData del contexto global
     * luego recorre cada para poner el valor contrario de este
     * 
     * con la ayuda de las funciones hsltorgb() y rgbtohsl() lo que hara esta funcion 
     * sera pasar los valores RGB a hsl para luego subir el brillo un 25%
     * luego de subir el brillo, se vuelve a pasar a RGB
     */
    function masBrillo() {
        let imageData = context.getImageData(0,0,c.width,c.height);
        let rgb = [];
        let hsl = [];
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                rgb[0] = getRed(imageData,x,y);
                rgb[1] = getGreen(imageData,x,y);
                rgb[2] = getBlue(imageData,x,y);
                hsl = rgbToHsl(rgb[0],rgb[1],rgb[2]);

                hsl[2] *= 1.25;
                if (hsl[2] > 1) {
                    hsl[2] = 1
                }

                rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);
                setPixel(imageData,x,y,rgb[0],rgb[1],rgb[2],255);
            }
        }
        context.putImageData(imageData,0,0);
    }

    /**
     * esta funcion sera llamada de un boton,
     * toma la imageData del contexto global
     * luego recorre cada para poner el valor contrario de este
     * 
     * con la ayuda de las funciones hsltorgb() y rgbtohsl() lo que hara esta funcion 
     * sera pasar los valores RGB a hsl para luego bajar el brillo un 25%
     * luego de subir el brillo, se vuelve a pasar a RGB
     */
    function menosBrillo() {
        let imageData = context.getImageData(0,0,c.width,c.height);
        let rgb = [];
        let hsl = [];
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                rgb[0] = getRed(imageData,x,y);
                rgb[1] = getGreen(imageData,x,y);
                rgb[2] = getBlue(imageData,x,y);
                hsl = rgbToHsl(rgb[0],rgb[1],rgb[2]);

                hsl[2] *= .75;

                rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);
                setPixel(imageData,x,y,rgb[0],rgb[1],rgb[2],255);
            }
        }
        context.putImageData(imageData,0,0);
    }

    /**
     * esta funcion sera llamada de un boton,
     * toma la imageData del contexto global
     * luego recorre cada para poner el valor contrario de este
     * 
     * de la siguiente pagina encontre como pasar los valores RGB a una tonalidad mas sepia
     * https://stackoverflow.com/questions/1061093/how-is-a-sepia-tone-created
     */
    function sepia() {
        let imageData = context.getImageData(0,0,c.width,c.height);
        let r,g,b =0;
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                r = (getRed(imageData,x,y) * .393) + (getGreen(imageData,x,y) *.769) + (getBlue(imageData,x,y) * .189);
                g = (getRed(imageData,x,y) * .349) + (getGreen(imageData,x,y) *.686) + (getBlue(imageData,x,y) * .168);
                b = (getRed(imageData,x,y) * .272) + (getGreen(imageData,x,y) *.534) + (getBlue(imageData,x,y) * .131);
                setPixel(imageData,x,y,r,g,b,255);
            }
        }
        context.putImageData(imageData,0,0);
    }
    
    /**
     * esta funcion sera llamada de un boton,
     * toma la imageData del contexto global
     * luego recorre cada para poner el valor contrario de este
     * 
     * la funcion blur lo que hace es, tomar una copia de imageData (imageDataBlur)
     * en esta nueva copia, en cada pixel, los valores rgb seran un promedio de los valores adyacente a este, en la matriz (incluyendo el mismo valor)
     * aprendi esto de este video --> https://www.youtube.com/watch?v=7jNEvl8KIr0
     * sinceramente creo que esta parte del codigo esta mal, por que hay mucha repeticion de codigo, pero no supe como achicarlo
     */
    function blur() {
        let imageData = context.getImageData(0,0,c.width,c.height);
        let imageDataBlur = imageData;
        let r,g,b =0;
        let w = c.width;
        let h = c.height;
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                // blur en las esquinas
                if(x == 0 && y == 0){
                    r = (getRed(imageData,x,y) + getRed(imageData,x,y-1) + getRed(imageData,x+1,y-1) + getRed(imageData,x+1,y))/4;
                    g = (getGreen(imageData,x,y) + getGreen(imageData,x,y-1) + getGreen(imageData,x+1,y-1) + getGreen(imageData,x+1,y))/4;
                    b = (getBlue(imageData,x,y) + getBlue(imageData,x,y-1) + getBlue(imageData,x+1,y-1) + getBlue(imageData,x+1,y))/4;
                }else{
                    if (x == c.width-1 && y == 0) {
                        r = (getRed(imageData,x,y) + getRed(imageData,x-1,y-1) + getRed(imageData,x-1,y) + getRed(imageData,x,y-1))/4;
                        g = (getGreen(imageData,x,y) + getGreen(imageData,x-1,y-1) + getGreen(imageData,x-1,y) + getGreen(imageData,x,y-1))/4;
                        b = (getBlue(imageData,x,y) + getBlue(imageData,x-1,y-1) + getBlue(imageData,x-1,y) + getBlue(imageData,x,y-1))/4;
                    }else{
                        if (x == 0 && y == c.height-1) {
                            r = (getRed(imageData,x,y) + getRed(imageData,x,y+1) + getRed(imageData,x+1,y) + getRed(imageData,x+1,y+1))/4;
                            g = (getGreen(imageData,x,y) + getGreen(imageData,x,y+1) + getGreen(imageData,x+1,y) + getGreen(imageData,x+1,y+1))/4;
                            b = (getBlue(imageData,x,y) + getBlue(imageData,x,y+1) + getBlue(imageData,x+1,y) + getBlue(imageData,x+1,y+1))/4;
                        }else{
                            if (x == c.width-1 && c.height-1) {
                                r = (getRed(imageData,x,y) + getRed(imageData,x-1,y) + getRed(imageData,x-1,y+1) + getRed(imageData,x,y+1))/4;
                                g = (getGreen(imageData,x,y) + getGreen(imageData,x-1,y) + getGreen(imageData,x-1,y+1) + getGreen(imageData,x,y+1))/4;
                                b = (getBlue(imageData,x,y) + getBlue(imageData,x-1,y) + getBlue(imageData,x-1,y+1) + getBlue(imageData,x,y+1))/4;
                            }
                        }
                    }
                }
                //blur en bordes
                if (y == 0 && x > 0 && x < w - 1) {
                    r = (getRed(imageData,x,y) + getRed(imageData,x-1,y-1) + getRed(imageData,x-1,y) + getRed(imageData,x,y-1) + getRed(imageData,x+1,y-1) + getRed(imageData,x+1,y))/6;
                    g = (getGreen(imageData,x,y) + getGreen(imageData,x-1,y-1) + getGreen(imageData,x-1,y) + getGreen(imageData,x,y-1) + getGreen(imageData,x+1,y-1) + getGreen(imageData,x+1,y))/6;
                    b = (getBlue(imageData,x,y) + getBlue(imageData,x-1,y-1) + getBlue(imageData,x-1,y) + getBlue(imageData,x,y-1) + getBlue(imageData,x+1,y-1) + getBlue(imageData,x+1,y))/6;
                }else{
                    if (y > 0 && y < h-1 && x == w-1) {
                        r = (getRed(imageData,x,y) + getRed(imageData,x-1,y-1) + getRed(imageData,x-1,y) + getRed(imageData,x-1,y+1) + getRed(imageData,x,y+1) + getRed(imageData,x,y-1))/6;
                        g = (getGreen(imageData,x,y) + getGreen(imageData,x-1,y-1) + getGreen(imageData,x-1,y) + getGreen(imageData,x-1,y+1) + getGreen(imageData,x,y+1) + getGreen(imageData,x,y-1))/6;
                        b = (getBlue(imageData,x,y) + getBlue(imageData,x-1,y-1) + getBlue(imageData,x-1,y) + getBlue(imageData,x-1,y+1) + getBlue(imageData,x,y+1) + getBlue(imageData,x,y-1))/6;
                    }else{
                        if(x > 0 && x <w-1 && y == h-1){
                            r = (getRed(imageData,x,y) + getRed(imageData,x-1,y) + getRed(imageData,x-1,y+1) + getRed(imageData,x,y+1) + getRed(imageData,x+1,y) + getRed(imageData,x+1,y+1))/6;
                            g = (getGreen(imageData,x,y) + getGreen(imageData,x-1,y) + getGreen(imageData,x-1,y+1) + getGreen(imageData,x,y+1) + getGreen(imageData,x+1,y) + getGreen(imageData,x+1,y+1))/6;
                            b = (getBlue(imageData,x,y) + getBlue(imageData,x-1,y) + getBlue(imageData,x-1,y+1) + getBlue(imageData,x,y+1) + getBlue(imageData,x+1,y) + getBlue(imageData,x+1,y+1))/6;
                        }else{
                            if(x == 0 && y > 0 && y < h-1){
                                r = (getRed(imageData,x,y) + getRed(imageData,x,y+1) + getRed(imageData,x,y-1) + getRed(imageData,x+1,y-1) + getRed(imageData,x+1,y) + getRed(imageData,x+1,y+1))/6;
                                g = (getGreen(imageData,x,y) + getGreen(imageData,x,y+1) + getGreen(imageData,x,y-1) + getGreen(imageData,x+1,y-1) + getGreen(imageData,x+1,y) + getGreen(imageData,x+1,y+1))/6;
                                b = (getBlue(imageData,x,y) + getBlue(imageData,x,y+1) + getBlue(imageData,x,y-1) + getBlue(imageData,x+1,y-1) + getBlue(imageData,x+1,y) + getBlue(imageData,x+1,y+1))/6;
                            }
                        }
                    }
                }
                //blur en cualquier otro lugar
                if(x>0 && y>0 && x<w-1 && y<h-1){
                    r = (getRed(imageData,x,y) + getRed(imageData,x-1,y-1) + getRed(imageData,x-1,y) + getRed(imageData,x-1,y+1) + getRed(imageData,x,y+1) + getRed(imageData,x,y-1) + getRed(imageData,x+1,y-1) + getRed(imageData,x+1,y) + getRed(imageData,x+1,y+1))/9;
                    g = (getGreen(imageData,x,y) + getGreen(imageData,x-1,y-1) + getGreen(imageData,x-1,y) + getGreen(imageData,x-1,y+1) + getGreen(imageData,x,y+1) + getGreen(imageData,x,y-1) + getGreen(imageData,x+1,y-1) + getGreen(imageData,x+1,y) + getGreen(imageData,x+1,y+1))/9;
                    b = (getBlue(imageData,x,y) + getBlue(imageData,x-1,y-1) + getBlue(imageData,x-1,y) + getBlue(imageData,x-1,y+1) + getBlue(imageData,x,y+1) + getBlue(imageData,x,y-1) + getBlue(imageData,x+1,y-1) + getBlue(imageData,x+1,y) + getBlue(imageData,x+1,y+1))/9;
                }
                setPixel(imageDataBlur,x,y,r,g,b,255);
            }

        }
        context.putImageData(imageData,0,0);
    }

    /**
     * esta funcion sera llamada de un boton,
     * toma la imageData del contexto global
     * luego recorre cada para poner el valor contrario de este
     * 
     * con la ayuda de las funciones hsltorgb() y rgbtohsl() lo que hara esta funcion 
     * sera pasar los valores RGB a hsl para luego subir la saturacion un 25%
     * luego de subir el brillo, se vuelve a pasar a RGB
     */
    function subirSaturacion() {
        let imageData = context.getImageData(0,0,c.width,c.height);
        let rgb = [];
        let hsl = [];
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                rgb[0] = getRed(imageData,x,y);
                rgb[1] = getGreen(imageData,x,y);
                rgb[2] = getBlue(imageData,x,y);
                hsl = rgbToHsl(rgb[0],rgb[1],rgb[2]);

                hsl[1] *= 1.25;
                if (hsl[1] > 1) {
                    hsl[1] = 1
                }

                rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);
                setPixel(imageData,x,y,rgb[0],rgb[1],rgb[2],255);
            }
        }
        context.putImageData(imageData,0,0);
    }

    /**
     * esta funcion sera llamada de un boton,
     * toma la imageData del contexto global
     * luego recorre cada para poner el valor contrario de este
     * 
     * con la ayuda de las funciones hsltorgb() y rgbtohsl() lo que hara esta funcion 
     * sera pasar los valores RGB a hsl para luego bajar la saturacion un 25%
     * luego de subir el brillo, se vuelve a pasar a RGB
     */
    function bajarSaturacion() {
        let imageData = context.getImageData(0,0,c.width,c.height);
        let rgb = [];
        let hsl = [];
        for (let x = 0; x < c.width; x++) {
            for (let y = 0; y < c.height; y++) {
                rgb[0] = getRed(imageData,x,y);
                rgb[1] = getGreen(imageData,x,y);
                rgb[2] = getBlue(imageData,x,y);
                hsl = rgbToHsl(rgb[0],rgb[1],rgb[2]);

                hsl[1] *= .75;

                rgb = hslToRgb(hsl[0],hsl[1],hsl[2]);
                setPixel(imageData,x,y,rgb[0],rgb[1],rgb[2],255);
            }
        }
        context.putImageData(imageData,0,0);
    }

    //asignacion de evento a cada boton
    document.querySelector("#botonNegativo").addEventListener("click",negativo);
    document.querySelector("#botonBinarizacion").addEventListener("click",binarizacion);
    document.querySelector("#botonSepia").addEventListener("click",sepia);
    document.querySelector("#botonBlur").addEventListener("click",blur);
    document.querySelector("#botonMasBrillo").addEventListener("click",masBrillo);
    document.querySelector("#botonMenosBrillo").addEventListener("click",menosBrillo);
    document.querySelector("#botonMasSaturacion").addEventListener("click",subirSaturacion);
    document.querySelector("#botonMenosSaturacion").addEventListener("click",bajarSaturacion);
    document.querySelector(".botonDescartar").addEventListener("click",canvaBlanco);
    document.querySelector(".botonGuardar").addEventListener('click',descargarImagen);

    /**
     * esta funcion aprendi a hacerla de la siguiente pagina 
     * --> https://parzibyte.me/blog/2019/07/10/canvas-a-imagen-png-para-descargarla/
     */
    function descargarImagen(){
        // Crea un elemento <a>
        let link = document.createElement('a');
        //este sera nombre que trendra el archivo
        link.download = "canva.png";
        // Convertir la imagen a Base64 y ponerlo en el enlace
        link.href = c.toDataURL();
        // Hacer click en él
        link.click();
    }
});