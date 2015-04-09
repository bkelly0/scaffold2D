/*
* PriorityQueue using QuickSort
*/
function PriorityQueue() {

}
PriorityQueue.prototype = {
    data: [],
    count: 0,
    insert: function (value, priority) {
        this.data[this.data.length] = {
            v: value,
            p: priority
        };
        this.sort();
    },
    pop: function () {
        return this.data.shift();
    },
    size: function () {
        return this.data.length;
    },
    empty: function() {
    	return this.data.length;
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