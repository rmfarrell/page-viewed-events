function pageViewEvents(pageMilestones, container) {
	
	if (typeof pageMilestones !== 'object') throw('expected an array')
	
	pageMilestones.sort(function(a,b){return a-b});
	
	var pageViewedEvents = [];
	
	var container = (document.getElementById(container)) ? document.getElementById(container) : document.getElementsByTagName('body')[0];
	
	var mArray = [0]; //holder milestones as numbers
	
	var brackets = [];
	
	var containerHeight = container.scrollHeight;
	
	var _upateContainerHeight = function() {
		
		window.addEventListener('resize', function() {

			containerHeight = container.offsetHeight;
		});
	}
	
	var _executeEvents = function(index) {
		
		return dispatchEvent(pageViewedEvents[index]);
	}
	
	var _updateArrayOfMilestones = function(milestones) {
		
		milestones.forEach(function(m, i) {
			mArray.push(m)
		});
	};
	
	var _updateRanges = function() {
	
		mArray.forEach(function(m,i) {
		
			var upperLimit = mArray[i + 1] || mArray[mArray.length - 1],
		    lowerLimit = m;
		    
			brackets.push([lowerLimit,upperLimit]);
		});
	};
	
	var _milestoneReached = function(bracket, indexOfBracket) {
		
		var reachedMilestone = bracket[0]; //This is the lowerlimit of the range passed as first param
		
		_executeEvents(indexOfBracket - 1);
		
		//Prevent page from hitting this range again
		bracket[0] = -1;
		bracket[1] = -1;
	};
	
	var _evaluateMilestone = function (pct) {
		
		var lastBracket = brackets[brackets.length - 1];
		
		//trigger milestone reached action if page viewed percent is greater than upperlimit of last bracket
		if (pct >= lastBracket[1]) return _milestoneReached(lastBracket, brackets.length - 1);
		
		//Loop through remaining brackets and trigger milestone reached if pct falls within their range
		else {
		
			for (var x = 1; x  < brackets.length - 1; x++) {
		
				if (pct >= brackets[x][0] && pct <= brackets[x][1]) return _milestoneReached(brackets[x], x);
			}
		}
	};
	
	var _attachHandlers = function() {
		
		//Scroll in viewport helper function
		return window.addEventListener('scroll', function() {
			
			_evaluateMilestone(_percentPageViewed(), mArray);
		}); 
	};
	
	var _percentPageViewed = function() {
		
		var windowHeight = window.innerHeight;
			
			bottomOfViewPort = window.pageYOffset + windowHeight,
			
			percentViewed = Math.round((bottomOfViewPort / containerHeight) * 100);
			
		return percentViewed;
	};
	
	var _createCustomEvents = function() {
		
		return pageMilestones.forEach(function(m, i) {
			
			var eventName = "viewed" + m;
			
			var ev = new CustomEvent(eventName, {
			});
			pageViewedEvents.push(ev)
		});
	};
	
	var _checkForErrors = function(arr) {
		
		console.log(typeof arr)
		
		if (typeof arr === 'object') alert('test')
		
		console.log();
		
	}
	
	var _init = function () {
		
		//set array of milestones
		_updateArrayOfMilestones(pageMilestones);
		
		//update range of milestones
		_updateRanges();
		
		//Loop through milestones and create named event listeners to container
		_createCustomEvents();
		
		//Update the containerHeight variable on window resize
		_upateContainerHeight();
		
		//Attach the new listeners to the container
		_attachHandlers();
	};
	
	_init();
	
	return pageViewedEvents;
}