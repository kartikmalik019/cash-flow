let map = new Map();
let nodes = [];
let edges = [];
const from = []
const to = []
for(let i = 0;i<from.length;i++){
    if(!map.has(from[i])){
        nodes.push({id:from[i],label:"Node "+from[i]})
    }
    map.set(from[i],new Set())
}
for(let i = 0;i<from.length;i++){
    map.get(from[i]).add(to[i])
    edges.push({from:from[i],to:to[i],label:"55"})
}


// load graphs
const loadGraph = (N,E)=>{
    var nodes = new vis.DataSet(N);
    var edges = new vis.DataSet(E);
    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        edges:{
            arrows:{to:true}
        }
    };
    var network = new vis.Network(container, data, options);
}

const loadSimplifiedGraph = (N,E)=>{
    var nodes = new vis.DataSet(N);
    var edges = new vis.DataSet(E);
    var container = document.getElementById('mynetwork2');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        edges:{
            arrows:{to:true}
        }
    };
    var network = new vis.Network(container, data, options);
}


// utils
const addNode=(node,map,nodes)=>{
    if(!map.has(node)){
        nodes.push({id:node,label:"Node "+node})
        map.set(node,new Set())
    }
    loadGraph(nodes,edges)
}
const addEdge = (from,to,value,map,edges) =>{
    map.get(from).add(to)
    edges.push({from:from,to:to,label:value.toString()})
    loadGraph(nodes,edges)
}
loadGraph(nodes,edges)

const addNodeClick = () =>{
    const node = parseInt(document.getElementById("new-node").value,10)
    document.getElementById("new-node").value = ""
    addNode(node,map,nodes)
}

const addEdgeClick = () =>{
    const from = parseInt(document.getElementById("from").value,10)
    document.getElementById("from").value = ""
    const to = parseInt(document.getElementById("to").value,10)
    document.getElementById("to").value = ""
    const value = parseInt(document.getElementById("value").value,10)
    document.getElementById("value").value = ""
    addEdge(from,to,value,map,edges)
}


// cash flow minimization
const simplify = () =>{
    const minCashFlow = () =>{
        let amount = []
        for(let i = 0;i<=nodes.length;i++){
            amount.push(0)
        }
        for(let i = 0;i<edges.length;i++){
            amount[edges[i].from] -= parseInt(edges[i].label,10)
            amount[edges[i].to] += parseInt(edges[i].label,10)
        }
        amount.shift()
        let mxCredit = amount.indexOf(Math.max(...amount))
        let mxDebit = amount.indexOf(Math.min(...amount))
        let newEdges = []
        while(!amount[mxCredit] == 0 && !amount[mxDebit] == 0){
            const min = Math.min(-amount[mxDebit], amount[mxCredit]); 
            amount[mxCredit] -= min; 
            amount[mxDebit] += min;
            newEdges.push({from:mxDebit+1,to:mxCredit+1,label:min.toString()})
            mxCredit = amount.indexOf(Math.max(...amount))
            mxDebit = amount.indexOf(Math.min(...amount))
        }
        loadSimplifiedGraph(nodes,newEdges)
    }
    minCashFlow()
}