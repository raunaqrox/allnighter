// one link is 2 nodes and a line between them
// each link is a group
// each node can be part of many links
// each line can be part of only one link
// each node has a text

// format for full graph
// width_height_



var nodeObjects = {};
var lineObject = {};
var globalId = 0;
var GS = {
	"NODE_RADIUS" : 30,
	"ROOT_NODE_X" : 100,
	"ROOT_NODE_Y" : 150
};
var selectedNodeId = 1;
var defaultNodeColor = "#4f95da";
var selectColor = "#41629b";

function getRatioDimension(x, y){
	var viewW = view.viewSize._width;
	var viewH = view.viewSize._height;
	return {"x": (x/viewW), "y": (y/viewH)};
}


// {"1":{"children":[2,4], "x":123, "y":325
//	}
// }
function encodeToJson(){
	var encoded = {};
	var nodeKeys = Object.keys(nodeObjects);
	var lineKeys = Object.keys(lineObject);
	nodeKeys.forEach(function(key){
		encoded[key] = getNodeInfo(nodeObjects[key]);
	});
	lineKeys.forEach(function(key){
		encoded[key] = getLineInfo(lineObject[key]);
	});
	console.log(encoded);
	encoded.GS = GS;
	return JSON.stringify(encoded);
}

function getNodeInfo(node){
	var info = {};
	info.type = "n";
	info.parents = node.myParents.map(function(parent){return parent.myId});
	info.children = node.myChildren.map(function(child){return child.myId});
	info.id = node.myId;
	info.link = {"url": node.link, "_id": node.linkObject, "title": node.text.content};
	info.posRatio = getRatioDimension(node.position.x, node.position.y);
	return info;
}

function getLineInfo(line){
	var info = {};
	info.nodes = line.nodes.map(function(node){return node.myId});
	console.log(info.nodes);
	info.type = "l";
	return info;
}

function setRoot(id){
	nodeObjects[id].isRoot = true;
	return id;
}

function setNodeText(s){
	nodeObjects[selectedNodeId].text.content = s;
	view.draw();
}

function setNodeLinkObject(o){
	nodeObjects[selectedNodeId].linkObject = o;
}

function setNodeLink(url){
	nodeObjects[selectedNodeId].link = url;
}

function removeNodeAndLine(node){
	var linesToRemove = nodeObjects[node.myId].lines;
	for(var i = 0; i < linesToRemove.length; i++){
		lineObject[linesToRemove[i]].remove();
	}
	if(node.myParents.length){
		node.myParents.forEach(function(parent){
			var i = parent.myChildren.indexOf(node);
			if(i != -1){
				parent.myChildren.splice(i, 1);
			}
		});
		select(node.myParents[0]);
	}
	node.text.remove();
	delete nodeObjects[node.myId];
	node.remove();
}

function getId(){
	return globalId += 1;
}

function createNode(x, y, r, c){
	var tempNode = new Path.Circle(new Point(x, y), r);
	tempNode.myId = getId();
	tempNode.onDoubleClick = function(event){
		if(!this.myChildren.length && !this.isRoot)
			removeNodeAndLine(this);
	}
	tempNode.text = new PointText(new Point(x-r-30, y+r+20));
	tempNode.fillColor = c;
	tempNode.lines = [];
	tempNode.myChildren = [];
	tempNode.myParents = [];
	nodeObjects[globalId] = tempNode;
	tempNode.isRoot = false;
	return globalId;
}

function createLine(p1, p2){
	var tempLine = new Path.Line(p1.position, p2.position);
	tempLine.strokeColor = defaultNodeColor;
	tempLine.myId = getId();
	lineObject[tempLine.myId] = tempLine;
	lineObject[tempLine.myId].nodes = [p1, p2];
	return tempLine.myId;
}

function connectNode(id1, id2){
	var oParent = nodeObjects[id1];
	var oChild = nodeObjects[id2];
	oParent.myChildren.push(oChild);	
	oChild.myParents.push(oParent);
	var line = createLine(oParent, oChild);
	oChild.lines.push(line);
	nodeObjects[id1].lines.push(line);
	nodeObjects[id2].lines.push(line);
}

function onMouseDrag(event){
	if(event.item && event.item.myId == selectedNodeId){
		event.item.position += event.delta;
		event.item.text.position += event.delta;
		if(event.item.lines){
			var lines = event.item.lines;		
			for(var i = 0; i < lines.length; i++){
				var myLine = lineObject[lines[i]];
				myLine.segments = [myLine.nodes[0].position, myLine.nodes[1].position];
			}
		}		
	}
}

function select(node){
	if(selectedNodeId != node.myId){
		deselect();
	}
	node.fillColor = selectColor;
	selectedNodeId = node.myId;
}

function deselect(){
	// there was a bug here, selectedNodeId has a value that is not in nodeObjects
	if(nodeObjects[selectedNodeId]){
		nodeObjects[selectedNodeId].fillColor = defaultNodeColor;
		selectedNodeId = null;
	}
}

function onMouseDown(event){
	if(!event.item && !event.event.button){
		if(selectedNodeId){
			connectNode(selectedNodeId, createNode(event.point.x, event.point.y, GS.NODE_RADIUS, defaultNodeColor));
		}else{
			connectNode(rootId, createNode(event.point.x, event.point.y, GS.NODE_RADIUS, defaultNodeColor));
		}
	}else if(event.item && !event.event.button){
		// left click on node
		select(event.item);
		if(event.item.text.content){
			$('#currentPathLink').val(event.item.text.content);
		}
	}else if(event.item && event.event.button && selectedNodeId){
		// right click
		var firstNode = nodeObjects[selectedNodeId];
		var secondNode = event.item;
		if(!isDirectlyConnected(firstNode, secondNode) && secondNode.myParents){
			if(firstNode.myChildren.length > secondNode.myChildren.length){
				connectNode(selectedNodeId, secondNode.myId, true);
			}else{
				connectNode(secondNode.myId, selectedNodeId, true);
			}
		}
	}
}

function isDirectlyConnected(firstNode, secondNode){
	var i = firstNode.myParents.indexOf(secondNode.myId);
	if(i!=-1){
		return true;
	}
	i = secondNode.myParents.indexOf(firstNode.myId);
	if(i!=-1){
		return true;
	}
	return false;
}

var rootId;
 
function init(){
	rootId = setRoot(createNode(GS.ROOT_NODE_X, GS.ROOT_NODE_Y, GS.NODE_RADIUS, defaultNodeColor));
}

init();

$(document).ready(function(){
	var pathLink = $('#currentPathLink');
	pathLink.on('input change', function(e){
		var linkText = pathLink.val();
		setNodeText(linkText);

	});
	$('body').on('contextmenu', '#myCanvas', function(e){ return false; });
	var links = new Bloodhound({
	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
	queryTokenizer: Bloodhound.tokenizers.whitespace,
	remote:{
		url:'/api/link-search/?q=%QUERY',
		wildcard: '%QUERY'
	}
	});
	$('.path-search').typeahead(null,{
		name: 'link-search',
		display: 'title',
		templates: {
			suggestion: function(data){
				console.log(data);
				return "<h4>"+data.title+"</br><small> "+data.url+"</small></h4>";
			}
		},
		source: links
	}).on('typeahead:selected typeahead:autocompleted', function($e, datum){
		
		setNodeText(datum.title);
		setNodeLinkObject(datum._id);
		setNodeLink(datum.url);
	});
	$('.add-path-form').on('submit', function(e){
		$('.path-data').val(encodeToJson());
	});
});