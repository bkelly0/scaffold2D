/*
 * A* Search for pathfinding
 */

function AStarPathFind(pathProb) {
	this.problem = pathProb;
	this.closed = {};
}

AStarPathFind.prototype = {
	search: function() {
		var fringe = new PriorityQueue();
		var prevNode, node;
		var parents = {};
		var children;
		var dist=0;
		var step = 0;
		
		fringe.push(this.problem.getStartState(), 1);
	
		while(!fringe.empty()) {
			
			node = fringe.pop();
			if (this.problem.isGoal(node)) {
				var solution = [];
				//trace back solution
			     pNode = parents[node];
            	 solution.unshift(node[0]);
       
            	 while(1) {
            	 	solution.unshift(pNode[0]);
            	 	if (parents[pNode]!=undefined) {
            	 		pNode = parents[pNode];
            	 	} else {
            	 		break;
            	 	}
            	 }
				return solution;
			}
			
			//traverse the tree
			if (this.closed[node[0]]!=1) {
			 
				this.closed[node[0]] = 1; //add to closed
				children = this.problem.getChildNodes(node);
				//add costs with previous nodes
				if (step > 0) { 
               		 prevNode = parents[node];
                	dist = parents[node][1]+node[1];
                	node[1] = dist; //set accumulated distance
           		 } else {
                	dist = 0;
				 }
				 step++;
				 			
				var i=children.length;
				while(i--) {
					var child = children[i];
					if (this.closed[child[0]]!=1) {
						parents[child] = node;
						var h = this.heuristic(child[0][0], child[0][1]);
						fringe.push(child, dist+child[1]+h);
					}
				}
			}
		}
	},
	heuristic: function(row,col) {
		//manhattan distance from goal
		return Math.abs(row - this.problem.goal[0]) + Math.abs(col - this.problem.goal[1]);
	}
}

window.AStarPathFind = AStarPathFind;
