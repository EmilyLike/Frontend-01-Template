const net = require('net');

class Request{
    //method, url = host + port + path
    //headers content-type,content-length
    //body k/v
    constructor(options){
        this.method = options.method || 'GET';
        this.host = options.host;
        this.port = options.port || 80 ;
        this.path = options.path || '/'
        this.headers = options.headers || {};
        this.body = options.body || {};

        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = 'application/x-www-form-urlencoded';
        }
  
        if(this.headers["Content-Type"] === 'application/json')
            this.bodyText = JSON.stringify(this.body);
        else if(this.headers["Content-Type"] === 'application/x-www-form-urlencoded')
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');

        this.headers['Content-Length'] = this.bodyText.length;
    }
    toString(){
        //字符串变量使用反引号！！！
        return `${this.method} ${this.path} HTTP/1.1/\r\n
        ${Object.keys(this.headers).map(key => `${key}:${this.headers[key]}`).join('\r\n')}\r\n\r\n${this.bodyText}`
    }
    send(connection){
        return new Promise((resolve,reject)=>{
            const parser = new ResponseParser();
            if(connection){
                console.log(' if connection is true');
                connection.write(this.toString());
            } else { 
                console.log(' connection is false')
                connection = net.createConnection({
                host:this.host,
                port:this.port
                },() =>{
                    console.log(' execute toString');                    
                    connection.write(this.toString());        
                })
            }
            connection.on('data', (data) => {
                parser.receive(data.toString());
                console.log(data.toString())
                console.log(parser.statusLine);
                if(parser.isFinished){
                    resolve(parser.response)
                }

                // console.log(data.toString())
                // resolve(data.toString());
                connection.end();
            });
            connection.on('error', (err) => {
                reject(err);
                connection.end();
            });
        });
      
    } 
}




class ResponseParser{
    constructor(){
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;
    }

    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode:RegExp.$1,
            statusText:RegExp.$2,
            headers: this.headers,
            body:this.bodyParser.content.join('')
        }
    }
    receive(string){
        for(let i = 0;i < string.length;i++){
            this.receiveChar(string.charAt(i));
            
        }
    }
    receiveChar(char){
        if(this.current === this.WAITING_STATUS_LINE){
            if (char === '\r'){
                this.current = this.WAITING_STATUS_LINE_END;
            } else if (char === '\n'){
                this.current = this.WAITING_HEADER_NAME;
            }  else {
            this.statusLine += char;
            }
        }else if(this.current === this.WAITING_STATUS_LINE_END){
            if (char === '\n'){
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if(this.current === this.WAITING_HEADER_NAME){
            if(char === ":"){
                this.current = this.WAITING_HEADER_SPACE;
            } else if(char === '\r'){
                this.current === this.WAITING_HEADER_BLOCK_END;
                if(this.headers["Transfer-Encoding"] === "chunked" ){
                    this.bodyParser = new TrunkedBodyParser();
                }  
            } else{
                this.headerName += char;
            }
        }else if(this.current === this.WAITING_HEADER_SPACE){
            if(char===' '){
                this.current === this.WAITING_HEADER_VALUE;
            }
        }else if(this.current === this.WAITING_HEADER_VALUE){
            if(char === '\r'){
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = thia.headerValue;
                this.headerName = '';
                this.headerValue = '';
            } else {
                this.headerValue += char;
            }
        }else if(this.current = this.WAITING_HEADER_LINE_END){
            if(char === '\n'){
                this.current =this.WAITING_HEADER_NAME;
            }
        } else if(this.current === this.WAITING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.current = this.WAITING_BODY;
            }
        }else if(this.current === this.WAITING_BODY){
            this.bodyParser.receiveChar(char);
        }
    }
}

class TrunkedBodyParser{
    constructor(){
         this.WAITING_LENGTH = 0;
         this.WAITING_LENGTH_LINE_END = 1;
         this.READING_TRUNK = 2;
         this.WAITING_NEW_LINE = 3;
         this.WAITING_NEW_LINE_END = 4;

         this.length = 0;
         this.content = [];
         this.isFinished = false;
         this.current = this.WAITING_LENGTH;
         
    }

    receiveChar(char){
        if(this.current === this.WAITING_LENGTH){
             if(char === '\r'){
                 if(this.length === 0){
                     this.isFinished = true;
                 }
                 this.current = this.WAITING_LENGTH_LINE_END;
             }else{
                 this.length *=10;
                 this.length += char.charCodeAt(0) - '0'.charCodeAt(0);
             } 
        }else if(this.current === this.WAITING_LENGTH_LINE_END){
            if(char === '\n'){
                this.current = this.READING_TRUNK;
            }  
        } else if(this.current === this.READING_TRUNK){
            this.content.push(char);
            this.length--;
            if(this.length === 0){
                this.current = this.WAITING_NEW_LINE;
            }
        } else if (this.current === this.WAITING_NEW_LINE){
            if(char === '\r'){
                this.current = this.WAITING_NEW_LINE_END;
            }
        }else if(this.current === this.WAITING_LENGTH_LINE_END){
            if(char === '\n'){
                this.current = this.WAITING_LENGTH;
            }
        }
    }
}
void async function(){
    console.log('connect server');
    const request = new Request({
        method:"POST",
        host:"127.0.0.1",
        port:8088,
        path:'/',
        headers:{
            ['X-Foo2']:'customed'
        },
        body:{
            name:'Mia',
            sex:'female',
            age:'19'
        }
    });
    // console.log(request);
    let response = await request.send();
    console.log('----',response);
}() 

/*
const client = net.createConnection({ 
    host:'127.0.0.1',
    port: 8088 }, () => {
  // 'connect' listener.
  
  console.log('connected to server!');
  const request = new Request({
       method:"POST",
       host:"127.0.0.1",
       port:"8088",
       path:'/',
       body:{
           name:'Mia',
           sex:'female'
       },
       headers:{
           ['X-Foo2']:'constom'
       }
    })
    console.log(request.toString())
    client.write(request.toString())

//   client.write('POST / HTTP/1.1/\r\nContent-Type: application/x-www-form-urlencoded\r\n Content-Length: 11\r\n\r\nname = winter');
 console.log('write sussess');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
*/