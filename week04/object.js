
//统计对象路径
import G6 from './node_modules/@antv/g6';

const editor = new G6.Graph({
    container:'mountNode',
    width:800,
    height:800,
});

//realm 全部对象
var globalProperties = [ 'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt','decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'Array', 'Date', 'RegExp', 'Promise', 'Proxy', 'Map', 'WeakMap', 'Set', 'WeakSet', 'Function', 'Boolean', 'String', 'Number', 'Symbol', 'Object', 'Error', 'EvalError', 'RangeError', 'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'Float32Array', 'Float64Array', 'Int8Array', 'Int16Array', 'Int32Array', 'Uint8Array', 'Uint16Array', 'Uint32Array', 'Uint8ClampedArray', 'Atomics', 'JSON', 'Math', 'Reflect']
var set= new Set();
var queue =[];

let current;

for(var p of globalProperties){
    queue.push({
        path:[p],
        object:this[p]
    })
    // console.log(p,'-----',this[p])
}

while(queue.length){
    current = queue.shift();
    // console.log(current.path)
    console.log(current.path.join('.'))
    if(set.has(current.object)){
        continue;
    }
    // console.log(current)
    set.add(current.object);
    // console.log('current_obj',current.object);
    for(let p of Object.getOwnPropertyNames(current.object)){
        var property = Object.getOwnPropertyDescriptor(current.object,p);
        
        // if(p == 'input')
        //     debugger;

        if(property.hasOwnProperty('value') && 
        ((property.value != null) && (typeof property.value == 'object') || (typeof property.value == 'object')) &&
        property.value instanceof Object)
            {
                queue.push({
                path:current.path.concat([p]),
                object:property.value});
            }
        if(property.hasOwnProperty('get') && (typeof property.get == 'function')){
            // debugger;
            queue.push({
                path:current.path.concat([p]),
                object:property.get})
        }
        if(property.hasOwnProperty('set') && (typeof property.set == 'function')){
            // debugger;
        queue.push({
            path:current.path.concat([p]),
            object:property.set});
        }

    }

    

}