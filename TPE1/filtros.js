console.log("importado");
//funcion filtro
export function getRed(imageData, x, y) {
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

function setPixel(imageData, x, y, r, g, b ,a) {
    let index = (x + y * imageData.height)*4;
    imageData.data[index] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

function aplicarFiltro(filtro) {
    let ctx = context;
    switch (filtro) {
        case "Negativo":
            //negativo();
            break;
        case "brillo":
            //brillo();
            break;
        case "binarizacion":
            //Binarización
            break;
        case "sepia":
            //sepia
            break;
        case "bordes":
            //bordes
            break;
        case "blur":
            //blur;
            break;
        default:
            //ningunfiltro();
        break;
    }
}
