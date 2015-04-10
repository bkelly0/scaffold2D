/*
 * Problem for Path Finding:
 * map: tilemap
 * goalPosition: array of goal tile position [row, column] 
 * startPosition: start from [row,column]
 */
function PathFindingProblem(map, startPosition, goalPosition) {
	this.map = map;
	this.goal = goalPosition;
	this.start = startPosition;
}

PathFindingProblem.prototype = {
	isGoal: function (state) {
		//state is an array with  position as an array and the cost
		return (state[0][0] == this.goal[0] && state[0][1]==this.goal[1]);
	},
	getChildNodes: function(node) {
		//get children that are not walls
		var row = node[0][0];
		var col = node[0][1];

		var children = [];
		//top
		if (row>0 && this.map.mapArray[row-1][col] < this.map.collideIndex) {
			children[children.length] = [[row-1,col],1];
		}
		//bottom
		if (row<this.map.numRows-1 && this.map.mapArray[row+1][col] < this.map.collideIndex) {
			children[children.length] = [[row+1,col],1];
		}
		//left
		if (col>0 && this.map.mapArray[row][col-1] < this.map.collideIndex) {
			children[children.length] = [[row,col-1],1];
		}
		//right
		if (col<this.map.numCols-1 && this.map.mapArray[row][col+1] < this.map.collideIndex) {
			children[children.length] = [[row,col+1],1];
		} 
		
		return children;
	},
	getStartState: function() {
		return [this.start, 1]; //[startPos, cost]
	}
}

window.PathFindingProblem = PathFindingProblem;

