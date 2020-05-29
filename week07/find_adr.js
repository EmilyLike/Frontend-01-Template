var lst = document.getElementById("container");
var len = lst.children.length;
var css_adr =[];
for(let i = 0;i<len;i++){
    if(lst.children[i].getAttribute('data-tag').match(/css/)){
        // console.log(1);
        var css_name = lst.children[i].children[1].innerText;
        var adr = lst.children[i].children[1].children[0]['href'];
        // css_adr.push({name:css_name,id:i,url:adr});
        css_adr.push({name:css_name,url:adr});
    }
}
console.log(JSON.stringify(css_adr,null,"        "));