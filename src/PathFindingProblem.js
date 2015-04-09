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
		return (state[0][0] == this.goal[0] && column[0][1]==this.goal[1]);
	},
	getChildNodes: function(row, column) {
		//TODO: check surrounding child nodes for walls
	},
	getStartState: function() {
		return [this.start, 1]; //[startPos, cost]
	}
}



