module.exports = {
    makeid,
}

function makeid(lenght){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLenght = characters.length;
    for(var i = 0; i < lenght; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLenght));
    }
    return result;
}

