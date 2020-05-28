var parser = require("./parser.js")
var html = `<html maaa=a >
<head>
    <title>HTML parser</title>
    <style>
    body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img id='myid'/>
        <img />
    </div>
</body>
</html>`;
void async function(){
    let dom = parser.parseHTML(html);
    console.log(dom);
}()