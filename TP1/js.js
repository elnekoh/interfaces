document.addEventListener('DOMContentLoaded', function(event){
    //actividad 1
    function maxValor(m) {
        let matriz = m;
        let mayor = 0;
        let x = 0;
        let y = 0;
        for (let i = 0; i < matriz.length; i++) {
            for (let j = 0; j < 100; j++) {
                if(matriz[i][j] > mayor){
                    mayor = matriz[i][j];
                    x= j;
                    y= i;
                }
            }
        }
    
        console.log("el mayor fue:"+ mayor+" se encontro en: eje x: "+ x +" eje y: "+y);
    }
    
    function maxValorFilasParesMinImpares(m) {
        let matriz = m;
        let mayor = -1;
        let menor = 1000;
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                if ((i % 2) == 0) {
                    if (matriz[i][j] > mayor) {
                        mayor = matriz[i][j];
                    }
                }else{
                    if (matriz[i][j] < menor) {
                        menor = matriz[i][j];
                    }
                }
            }
        }
        console.log("mayor fila par: "+ mayor+" menor fila impar: "+menor);
    }
    
    function promedios(m) {
        let arrayPromedios = [];
        let suma = 0;
        for (let i = 0; i < 100; i++) {
            suma = 0;
            for (let j = 0; j < 100; j++) {
                suma+= m[i][j];
            }
            arrayPromedios.push(suma/100);
        }
        console.log(arrayPromedios);
    }
    
    let matriz = [];
    for (let i = 0; i < 100; i++) {
        matriz[i] = [];
        for (let j = 0; j < 100; j++) {
            matriz[i][j]= Math.floor(Math.random() * 100);
        }
    }
    
    console.log(matriz);
    maxValor(matriz);
    maxValorFilasParesMinImpares(matriz);
    promedios(matriz);

    //actividad 2
    let c = document.getElementById("canva");
    let ctx = c.getContext("2d");
    ctx.fillRect(20, 20, 150, 100);

    //actividad 3
    function drawRect(imageData, a, width, height) {
        let color = 0;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                color = (y*255)/height;
                setPixel(imageData, x, y, color, color, color, a);
            }
        }
    }

    function setPixel(imageData, x, y, r, g, b ,a) {
        let index = (x + y * imageData.height)*4;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = a;
    }

    function actividad3 (){
        let canva2 = document.querySelector("#canva2");
        let ctx2 = canva2.getContext("2d");
        let width = canva2.width;
        let height = canva2.height;
        let imageData = ctx2.createImageData(width,height);
        
        drawRect(imageData, 255, width, height);
        ctx2.putImageData(imageData, 0, 0)*4;
        console.log(imageData)
    }
    actividad3();

    //actividad5
    function actividad5() {
        let canva3 = document.querySelector("#canva3");
        let ctx3 = canva3.getContext('2d');
        let width = canva3.width;
        let height = canva3.height;
        let imageData = ctx3.createImageData(width,height);

        dibujarGradienteDe3(imageData, 255, width, height);
        ctx3.putImageData(imageData,0,0)*4;
        console.log(imageData)
    }

    function dibujarGradienteDe3(imageData, a, width, height) {
        let r = 0;
        let g = 0;
        let constante = height / 2;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (y <= constante) {
                    r = (y*255)/constante;
                    g = r;
                }else{
                    r = 255
                    g = r - ((y*255)/constante) + r;
                }
                setPixel(imageData, x, y, r, g, 0, a);
            }
        }
    }
    actividad5();

    //actividad6
    function actividad6() {
        let canva4 = document.querySelector("#canva4");
        let ctx4 = canva4.getContext('2d');
        let width = canva4.width;
        let height = canva4.height;
        let imageData = ctx4.createImageData(width,height);

        dibujarGradienteDe3Armonia(imageData, 255, width, height);
        ctx4.putImageData(imageData,0,0)*4;
        console.log(imageData)
    }

    function dibujarGradienteDe3Armonia(imageData, a, width, height) {
        let r = 0;
        let g = 0;
        let b = 0;
        let constante = height / 2;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (y <= constante) {
                    r = (y*255)/constante;
                    g = 128 - ((y*128)/constante) + 128;
                    b = 0;
                }else{
                    r = 255;
                    g = 128 - ((y*128)/constante) + 128;
                    b = (y*172)/constante -172;
                }
                setPixel(imageData, x, y, r, g, b, a);
            }
        }
    }

    actividad6();

    //actividad7
    function actividad7() {
        let canva5 = document.querySelector("#canva5");
        let ctx5 = canva5.getContext('2d');
        let image = new Image();
        image.src ="imagen.jpg";

        image.onload = function(){
            ctx5.drawImage(this, 0, 0);

            let imageData = ctx5.getImageData(0,0,image.width,image.height);
            let gray = 0;
            for (let x = 0; x < canva5.width; x++) {
                for (let y = 0; y < canva5.height; y++) {
                    gray = (getRed(imageData,x,y) + getGreen(imageData,x,y) + getBlue(imageData,x,y))/3;
                    setPixel(imageData,x,y,gray,gray,gray,255);
                }
            }
            let ctx6 = document.querySelector("#canva6").getContext("2d");
            ctx6.putImageData(imageData,0,0);
        }
    }

    
    //actividad8
    function getRed(imageData, x, y) {
        let index = (x+ y * imageData.width) *4
        return imageData.data[index];
    }
    
    function getGreen(imageData, x, y) {
        let index = (x+ y * imageData.width) *4
        return imageData.data[index + 1];
    }
    
    function getBlue(imageData, x, y) {
        let index = (x+ y * imageData.width) *4
        return imageData.data[index + 2];
    }
    actividad7();
});
