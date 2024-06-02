import * as d3 from "d3";
import jsdom from "jsdom";



const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;

exports.handler = async (event, context) => {

  
  try {
   //
   let data = await d3.csv('/vueModule.csv')

   data = data.map((/** @type {{ pathname: any; size: any; }} */ item) => {
       return {
           id: item.pathname,
           size: item.size
       };
   });

   let rootNode = makeNode.convertToHierarchy(data, "moduls"); //A cambiar
   var root = d3.hierarchy(rootNode);
   const treeLayout = d3.cluster().size([360, 800]);
   treeLayout(root);

   const svg = d3.select('body')
   const g = svg.append("g").attr("transform", "translate(850,850)");

   const nodesGroup = g.append("g").attr("class", "nodes");
   const linksGroup = g.append("g").attr("class", "links");

   // Initial draw


   const descendants = root.descendants()
   const links = root.links()

   // Update nodes
   const nodes = nodesGroup.selectAll('circle.node')
       .data(descendants, (/** @type {{ id: any; }} */ d) => d.id);

   nodes.enter().append('circle')
       .attr('class', 'node')
       .attr('cx', 0)
       .attr('cy', (/** @type {{ y: number; }} */ d) => -d.y)
       .attr('r', 5)
       .attr("fill", "orange")
       .attr('stroke', "darkgray")
       .attr('stroke-width', 1)
       .attr("transform", (/** @type {{ x: any; }} */ d) => `rotate(${d.x}, 0, 0)`);

   // Update links
   const lineGen = d3.lineRadial()
       .angle((/** @type {{ x: number; }} */ d) => d.x * Math.PI / 180)
       .radius((/** @type {{ y: any; }} */ d) => d.y);

   const linkGen = d3.linkRadial()
       .angle((/** @type {{ x: number; }} */ d) => d.x * Math.PI / 180)
       .radius((/** @type {{ y: any; }} */ d) => d.y);

   const linksUpdate = linksGroup.selectAll('path.link')
       .data(links, (/** @type {{ source: { id: any; }; target: { id: any; }; }} */ d) => `${d.source.id}-${d.target.id}`);

   linksUpdate.enter().append("path")
       .attr('class', 'link')
       .attr('stroke', "darkgray")
       .attr('stroke-width', 2)
       .attr("d", linkGen)
       .merge(linksUpdate)
       .attr("d", (/** @type {{ target: any; source: any; }} */ d) => lineGen([d.target, d.source]));
   //
		return {
      statusCode: 200,
      headers: {
        'Content-type': 'text/html; charset=UTF-8',
      },
      body: body.node().innerHTML
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      }),
    };
  }
};