/*
* PriorityQueue using QuickSort
*/
function PriorityQueue() {
	this.data = [];

}
PriorityQueue.prototype = {
    data: [],
    count: 0,
    push: function (value, priority) {
        this.data[this.data.length] = {
            v: value,
            p: priority
        };
        this.sort();
    },
    noSortPush: function (value, priority) {
        //this is faster if pushing a lot of objects before a pop is done
    	this.data[this.data.length] = {
            v: value,
            p: priority
        };
    },
    pop: function () {
        return this.data.shift().v;
    },
    size: function () {
        return this.data.length;
    },
    empty: function() {
    	if (this.data.length>0)
    		return 0;
    	return 1;
    },
    qSort: function(begin,end) {
        if (begin < end-1) {
            var ret = [];
            var index = Math.round((begin+end)/2);
            index = this.qSortPartition(begin,end,index);
            this.qSort(begin,index);
            this.qSort(index,end);
        }
    },
    qSortPartition: function(begin, end, index) {
        pVal = this.data[index].p;
        while(1) {
       
            while(this.data[begin].p< pVal) {
                 begin++;   
            }
            end--;

            while(this.data[end].p> pVal) {
                end--;
            }
            if (begin >= end) {
                 return begin;   
            }
         
            this.qSwap(begin,end);
            begin++;
        }
    },
    qSwap: function(a,b) {
        temp = this.data[a];
        this.data[a] = this.data[b]; this.data[b]=temp;
    },
    sort: function() {
   		this.qSort(0,this.data.length);
    }
}
window.PriorityQueue = PriorityQueue;