try {

var showingFavorites = false;

function bigWindow(bubble)
{
	alert(bubble.innerText);
	$(bigwindow).show();
}

function toggleFavorites()
{
	if (showingFavorites)
	{
		$("#starButton").removeClass("selected");
		$("#wrapper").removeClass("favorites");
		$("#dialogue").show();
		$("#favoriteDialogue").hide();
		showingFavorites = false;
		$("#people").show();
		contactMothership("go:");
	}
	else
	{
		$("#starButton").addClass("selected");
		$("#wrapper").addClass("favorites");
		$("#dialogue").hide();
		$("#favoriteDialogue").show();
		showingFavorites = true;
		$("#people").hide();
		contactMothership("stop:");
		
		document.getElementById("favoriteDialogue").innerHTML = "";
		bubbles = getFavorites();
//		alert(bubbles);
		if (bubbles.length == 0)
		{
			var p = document.createElement("p");
			p.className = "instructions";
			p.innerText = "This is the favorites page. Tap here to go back, then tap the star next to a comeback to favorite it!";
			p.ontouchend = toggleFavorites;
			document.getElementById("favoriteDialogue").appendChild(p);
		}
		for (key in bubbles)
		{
			bubble = bubbles[key];
			insertBubble(bubble);
		}
		
	}
	bottom();
	pushBubblesDown();
	setTimeout("bottom();", 0);
}

/*
 window.onscroll = function() {
 document.getElementById('bigwindow').style.top =
 (window.pageYOffset + window.innerHeight - 440) + 'px';
 };
 */
buffer = "";

// if window.innerHeight == document.height then window needs no scroller yet

function contactMothership(prefix)
{
	var iframe = document.createElement("IFRAME");
	iframe.setAttribute("src", prefix + ":");
	document.documentElement.appendChild(iframe);
	iframe.parentNode.removeChild(iframe);
	iframe = null;
	
}

function showInsult(insult)
{
	var iframe = document.createElement("IFRAME");
	iframe.setAttribute("src", "show-insult:" + insult);
	document.documentElement.appendChild(iframe);
	iframe.parentNode.removeChild(iframe);
	iframe = null;
}

function bottom()
{
	window.scrollTo(0, document.body.scrollHeight);
}

function generateNext()
{
	buffer = generate();
}

function pushBubblesDown()
{
	dialogueHeight = $(window).height() - ((showingFavorites)?20:190);
	if (showingFavorites)
	{
		pusherHeight = dialogueHeight - $("#favoriteDialogue").height();
	}
	else
	{
		pusherHeight = dialogueHeight - $("#dialogue").height();
	}
	if (pusherHeight < 0)
	{
		$("#pusher").css("height", "auto");
		if (pusherHeight < -50)
		{
			$("#cloud").show();
		}
		else
		{
			$("#cloud").hide();
		}
	}
	else
	{
		$("#cloud").hide();
		$("#pusher").height(pusherHeight);
	}
}

function next()
{
	if (!showingFavorites)
	{
		insertBubble(buffer);
	}
}

function toggleFavorite(sender)
{
	$(sender).toggleClass('starred');

	if ($(sender).hasClass('starred'))
	{
		addFavorite(sender.parentElement.innerText)
	}
	else
	{
		removeFavorite(sender.parentElement.innerText);
	}
	
	console.log("YEAH");
	console.log(getFavorites());
}

function getFavorites()
{
	if (window.localStorage.favorites == null)
	{
		setFavorites([]);
		favorites = JSON.parse(window.localStorage.favorites);
	}
	else
	{
	favorites = JSON.parse(window.localStorage.favorites);
	if (favorites.length == 0)
	{
		setFavorites([]);
		favorites = JSON.parse(window.localStorage.favorites);
	}
	}
	return favorites;
}

function setFavorites(newFavorites)
{
	window.localStorage.favorites = JSON.stringify(newFavorites);
}

function addFavorite(comeback)
{
	favorites = getFavorites();
	favorites.push(comeback);
	setFavorites(favorites);
}

function favoriteExists(comeback)
{
	originalArray = getFavorites();
	var j = 0;
	while (j < originalArray.length)
	{
		if (originalArray[j] == comeback)
		{
			return true;
		} else { j++; }
	}
	return false;
}

//remove item (string or number) from an array
function removeItem(originalArray, itemToRemove) {
	var j = 0;
	while (j < originalArray.length) {
		//	alert(originalArray[j]);
		if (originalArray[j] == itemToRemove) {
			originalArray.splice(j, 1);
		} else { j++; }
	}
	//	assert('hi');
	return originalArray;
}

function removeFavorite(comeback)
{
	favorites = getFavorites();
	favorites = removeItem(favorites, comeback);
	setFavorites(favorites);
}

eventCancel = function (e)
{
	if (!e)
		if (window.event) e = window.event;
		else return;
	if (e.cancelBubble != null) e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
	if (e.preventDefault) e.preventDefault();
	if (window.event) e.returnValue = false;
	if (e.cancel != null) e.cancel = true;
}

var fLeftsTurn = "left";

function insertBubble(text)
{

	var wrapper = document.createElement("div");
	wrapper.className = "pwrapper";
	
	var p = document.createElement("span");
	if (showingFavorites)
	{
		p.className = fLeftsTurn;
	}
	else
	{
		p.className = window.localStorage.leftsTurn;	
	}
	p.innerHTML += text;

	p.fasttap(function() { showInsult(this.innerText); });

	var star = document.createElement("p");
    star.className = "star";
	if (favoriteExists(text)) { star.className = "star starred"; }
    star.fasttap(function() { toggleFavorite(this); });
    p.appendChild(star);

	wrapper.appendChild(p);
	
	if (showingFavorites)
	{
		dialogue = document.getElementById("favoriteDialogue");
	}
	else
	{
		dialogue = document.getElementById("dialogue");
	}
	dialogue.appendChild(wrapper);
	
	// Limit the total number of monologues on the page, so it doesn't get rediculously long.
	if (dialogue.children.length > 20)
	{
		dialogue.removeChild(dialogue.children[0]);
	}
	
	pushBubblesDown();
	bottom();

	if (showingFavorites)
	{
		fLeftsTurn = (fLeftsTurn == "left")?"right":"left";
	}
	else
	{
		window.localStorage.leftsTurn = (window.localStorage.leftsTurn == "left")?"right":"left";

	}

//	window.localStorage.dialogue = dialogue.innerHTML;
}

// Javascript Timer
//setInterval("next();", 5000);

function asyncInnerHTML(HTML, callback) {
    var temp = document.createElement('div'),
	frag = document.createDocumentFragment();
    temp.innerHTML = HTML;
    (function(){
	 if(temp.firstChild){
	 frag.appendChild(temp.firstChild);
	 setTimeout(arguments.callee, 0);
	 } else {
	 callback(frag);
	 }
	 })();
}

$(document).ready(function()
				  {
				  
				  if (window.localStorage.leftsTurn == null) { window.localStorage.leftsTurn = "right"; }
				  
/*				  if (window.localStorage.dialogue) {
//				  document.getElementById("dialogue").innerHTML = window.localStorage.dialogue;
				  asyncInnerHTML(window.localStorage.dialogue, function(c) {document.getElementById("dialogue").appendChild(c); setTimeout("bottom();pushBubblesDown();", 0);});
				  }*/
//				  else { 
				  generateNext();

				  next();

//				  }
				  
				  bottom();
				  pushBubblesDown();
				  
				  //				$("#dialogue").css("min-height",document.body.scrollHeight-170+"px");
				  document.getElementById("cloud").fasttap(bottom);
				  }
				  );

//document.getElementById("dialogue").onload = bottom;
//$(document).load(bottom);

} catch(e) {alert(e);}