
// import * as d3 from "d3"
// import jsdom from "jsdom";

// const { JSDOM } = jsdom;
// const { document } = (new JSDOM('')).window;
// global.document = document;

// var xScale = d3.scaleLinear().domain([-66.419422, -125.786406]).range([300, 0]);
// var yScale = d3.scaleLinear().domain([23.982057,50.508481]).range([180, 50]);

//     try {
//         /**
//          * @type {any[]}
//          */
//             var newCoord = [];
//             /**
//          * @type {any[]}
//          */
//         var areaAll = [];
//         const response = await fetch('http://localhost:8888/states_usa.bna.html', {
//         headers: {
//         'Content-Type': 'text/csv', // Establece el tipo de contenido como CSV
//         },
//         });
//     if (response.ok) {
//         const csvContent = await response.text(); // Obtiene el contenido del archivo como texto
//         var arrayCoord = csvContent.split('\n'); // Aquí puedes procesar el contenido según tus necesidades

//         var posc = 0;

//         /**
//          * @type {any[]}
//          */
//         var listCoord = [];
//         let elem = [];
//         arrayCoord.forEach(list => { //crear {id:, idUser:, numState:, coord:[{},..,{}]}
//             elem = list.split(',');
//             if(elem.length == 3){
//                 newCoord = newCoord.concat({stateId:elem[0],idUser:elem[1],
//                                                 size:elem[2], coord:[]});
//                 if(listCoord.length != 0){
//                     areaAll = areaAll.concat([listCoord]); //[{x:,y:},...,{x:,y:}]
//                 }
//                 posc ++;
//                 listCoord=[];
//             }else{
//                 newCoord[posc-1].coord = {x:elem[0],y:elem[1]};
//                 listCoord = listCoord.concat({x:elem[0], y:elem[1], id:newCoord[posc-1].stateId});
//             }
//         });
//         if (listCoord != []){
//             areaAll = areaAll.concat([listCoord]);
//         }
//     }else{
//         console.error('Error al descargar el archivo:', response.status);
//     }

//     return [newCoord,areaAll];
//     } catch (error) {
//         console.error('Error en la solicitud:', error);
//     }

// let prepareCoordRes = prepareCoord();
// // @ts-ignore
// let coord = prepareCoordRes[0]
// console.log(coord)
// // @ts-ignore
// let areaAll = prepareCoordRes[1]
// console.log(areaAll)

// var area = d3.area()
//             .x((/** @type {{ x: any; }} */ d) => xScale(d.x))
//             .y0((/** @type {{ y: any; }} */ d) => yScale(d.y))
//             .y1((/** @type {{ y: any; }} */ d) => yScale(d.y));



// let statesInfo;
// /**
//  * @type {any[]}
//  */
// let statesName = [];

// let response =await fetch('http://localhost:8888/states_name.csv');
// statesInfo =  (await response.text()).split('\n');

// statesName = statesInfo.map(elem => {
//     return elem.split(',').splice(0,3)
// })

// const nombreEstados = statesName.splice(1, statesName.length-1); //[id, siglas, nombreEstado]


// /**
//  * @param {number} id
//  */
// function buscarEstado(id) {
//     let nameState;
//     nombreEstados.forEach(state =>{ //[id, sigla, nombreEstado]
//         if (id == state[0]) {
//             nameState = state[2];
//         }
//     })
//     return nameState;
// }

// exports.handler = async (event, context) => {
// try{
//     const body =  d3.select(document).select("body")
//             .append("svg")
//             .attr("with","500")
//             .attr("height","600");

//     const dataSpec = body.selectAll("svg")
//         .data(areaAll)
//         .enter();

//     const groupMap = dataSpec.append("g");
//     groupMap.append("path")
//         .attr("d", (/** @type {any} */ d) => area(d))
//         .attr("stroke", "red");


//     groupMap.append("text")
//         .attr("x", (/** @type {any} */ d) => xScale(d3.mean(d, (/** @type {{ x: any; }} */ axisX) => axisX.x))) // Posición x del texto
//         .attr("y", (/** @type {any} */ d) => yScale(d3.mean(d, (/** @type {{ y: any; }} */ axisY) => axisY.y))) // Posición y del texto
//         .attr("text-anchor", "middle")
//         .attr("alignment-baseline", "middle")
//         .attr("font-size", '0.51vh')
//         .text((/** @type {{ id: number; }[]} */ d) => buscarEstado(d[0].id));

//     return {
//             statusCode: 200,
//             headers: {
//             'Content-type': 'text/html; charset=UTF-8',
//             },
//             body: body.node().innerHTML
//         }
//     } catch (error) {
//         return {
//         statusCode: 500,
//         body: JSON.stringify({
//             error: error.message
//         }),
//         };
//     }
//     };
