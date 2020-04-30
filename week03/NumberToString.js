function convertNumberToString(number,x) {
    if(arguments.length<2){
        x=10;
    }
    var integer = Math.floor(number);
    var fraction = number - integer;
    var str = '';
    while(integer>0){
        str=integer % x + str;
        integer = Math.floor(integer/x);
    }
    if(fraction){
        str += '.';
    }
   var j = 0;
    while (j<6){
        fraction = fraction*x;
        str += Math.floor(fraction);
        fraction = fraction - Math.floor(fraction);
        j++;
    }
    return str;
    
 }
