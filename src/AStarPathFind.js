/*
 * A* Search for pathfinding
 *
 *
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

		fringe.data = []; //? shouldn't have to clear this
		fringe.push(this.problem.getStartState(), 1);

	
		while(!fringe.empty()) {
			
			node = fringe.pop();
			
			if (this.problem.isGoal(node)) {
				var solution = [];
				//trace back solution
			     pNode = parents[node[0]];
            	 solution.unshift(node[0]);
       
            	 while(1) {
            	 	solution.unshift(pNode[0]);
            	 	if (parents[pNode[0]]!=undefined) {
            	 		pNode = parents[pNode[0]];
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
               		 prevNode = parents[node[0]];
               		 dist = parents[node[0]][1]+node[1];
                	
                	node[1] = dist; //set accumulated distance
           		 } else {
                	dist = 0;
				 }
				 step++;
				 			
				var i=children.length;
				var added = false; //new children added to fringe
				while(i--) {
					var child = children[i];
					if (this.closed[child[0]]!=1) {
						//console.log(child[0]);
						parents[child[0]] = node;
						var h = this.heuristic(child[0][0], child[0][1]);
						fringe.noSortPush(child, dist+child[1]+h);
						added = true;
					}
				}
				if (added) {
					fringe.sort();
				}
			}
		}
		return []; //solution not found
	},
	heuristic: function(row,col) {
		//manhattan distance from goal
		return Math.abs(row - this.problem.goal[0]) + Math.abs(col - this.problem.goal[1]);
	}
}

window.AStarPathFind = AStarPathFind;
