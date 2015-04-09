/*
 * A* Search for pathfinding
 */

function AStarPathFind(pathProb) {
	this.problem = pathProb;
}

AStarPathFind.prototype = {
	search: function() {
		var closed = [];
		var fringe = new PriorityQueue();
		var prevNode;
		var history = {};
		
		fringe.push(this.problem, 1);
		//TODO: implement A* and return list of tiles
	},
	heuristic: function(row,col) {
		//TODO: manhattan distance from goal
	}
}
