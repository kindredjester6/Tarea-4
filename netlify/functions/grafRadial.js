import * as d3 from "d3";
import jsdom from "jsdom";

const { JSDOM } = jsdom;
const { document } = (new JSDOM('')).window;
global.document = document;

class TreeNode {
  constructor(id, size) {
      this.id = id;
      this.size = size;
      this.children = [];
  }
}

function convertToHierarchy(lista, name) {
  const root = new TreeNode(name, null);
  
  lista.forEach(item => {
      const classes = item.id.split(".");
      let currentNode = root;
      
      classes.forEach(className => {
          let childNode = currentNode.children.find(child => child.id === className);
          if (!childNode) {
              childNode = new TreeNode(className, null);
              currentNode.children.push(childNode);
          }
          currentNode = childNode;
      });
      
      currentNode.size = item.size;
  });
  
  return root;
}



exports.handler = async (event, context) => {

  let url = event.queryStringParameters["url"];
  try {
   let data = await d3.csv(url)
   

   data = data.map((/** @type {{ pathname: any; size: any; }} */ item) => {
       return {
           id: Object.values(item)[0],
           size: Object.values(item)[1]
       };
   });

   let rootNode = convertToHierarchy(data, "flareClass"); //A cambiar
   var root = d3.hierarchy(rootNode);
   const treeLayout = d3.cluster().size([360, 500]);
   treeLayout(root);

   const body = d3.select(document).select("body");

   const svg = body.append("svg")
      .attr("id", "grafRad")
      .attr("width", 600*3)
      .attr("height", 400*3);

   const g = svg.append("g")
        .attr("transform", "translate("+(600*3)/2+","+(400*3)/2+")");

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

