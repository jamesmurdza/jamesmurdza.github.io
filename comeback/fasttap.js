// callAsync calls a function without disrupting the current thread, and sets the "this" variable to obj

Function.callAsyncFunction = new Array(); // Arrays allow us to deal with multiple functions at a time.
Function.callAsyncObj = new Array();
Function.prototype.callAsync = function(obj)
{
	Function.callAsyncFunction.push(this);
	Function.callAsyncObj.push(obj);
	setTimeout("Function.callAsyncFunction.pop().call(Function.callAsyncObj.pop())", 0);
}

// fasttap adds a listener to simulate an instant onclick with only touch events

HTMLElement.prototype.fasttap = function(callback, bubble)
{
	this.fttouchstarted = false;
	this.fttouchmoved = false;
	this.ftcallback = callback;
	this.ftbubble = bubble;
	
	this.addEventListener('touchstart', this.fasttap.touchstart);
	this.addEventListener('touchmove', this.fasttap.touchmove);
	this.addEventListener('touchend', this.fasttap.touchend);
}

HTMLElement.prototype.fasttap.touchstart = function(e)
{
	this.fttouchstarted = true;
	if (!this.ftbubble) { e.stopPropagation(); }
}

HTMLElement.prototype.fasttap.touchmove = function(e)
{
	this.fttouchmoved = true;
	if (!this.ftbubble) { e.stopPropagation(); }
}

HTMLElement.prototype.fasttap.touchend = function(e)
{
	if (this.fttouchstarted && !this.fttouchmoved)
	{
		this.ftcallback.callAsync(this);
	}
	
	this.fttouchstarted = false;
	this.fttouchmoved = false;
	
	if (!this.ftbubble) { e.stopPropagation(); }
}