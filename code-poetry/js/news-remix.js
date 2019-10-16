let titles = [];
let imageUrls = [];
const markovTitles = {};
const markovContent = {};
const incompleteClause = ['of', 'to', 'and', 'with', 'from', 'at', 'the', 'is', 'are', 'an', 'a', 'where', 'when', 'in', 'on', 'their', 'her', 'his'];

window.onload = function () {
	$.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=cb15d26e791f471abee466ce78d79760', data => {
		data.articles.forEach(article => {
			titles.push(article.title.split(' - ')[0])
			imageUrls.push(article.urlToImage);
		})
		markovChainGenerator(titles, markovTitles)
		remix();
	})

	const date = new Date();
	document.getElementById('date').innerText = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// modified from https://medium.com/@alexkrameris/markov-chain-implementation-in-javascript-a698f371d66f
function markovChainGenerator(text, markovChain) {
	const textArr = [];

	text.forEach((el) => { 
		el.split(' ').forEach((word) => { 
			textArr.push(word) 
		})
	})

	for (let i = 0; i < textArr.length; i++) {
	    let word = textArr[i]//.replace(/[\W_]/, "")
		    if (!markovChain[word]) {
	    		markovChain[word] = []
	    	}
		    if (textArr[i + 1] && word.length > 0) {
		      markovChain[word].push(textArr[i + 1])//.replace(/[\W_]/, ""));
			}
	}
}

function getMarkovText(markovChain) {
	const words = Object.keys(markovChain)
	let word = words[Math.floor(Math.random() * words.length)]
	let result = ''
	for (let i = 0; i < 12; i++ ) {
 		result += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() + ' ';
		newWord =  markovChain[word][Math.floor(Math.random() * markovChain[word].length)]
		word = newWord;
  		if (!word || !markovChain.hasOwnProperty(word)) word = words[Math.floor(Math.random() * words.length)]

  		if (incompleteClause.indexOf(newWord) > -1) {
  			i -= 2;
  		}
  	}

  	return result;
}

function remix() {
  	let imageSrc = '';
  	let numImages = Math.floor(Math.random() * imageUrls.length) + 4;

  	for (let i = 0; i < numImages; i += 1) {
	  	imageSrc += `<div class='image-container' style='width:${getOffset(160)}%; transform:translate(${getOffset(50)}%, ${getOffset(50)}%,0)'>
	  		<img style='transform:translate(${getOffset(-50)}%,${getOffset(-50)}%)' src='${imageUrls[getOffset(imageUrls.length)]}'/>
	  	</div>`;
	 }

	document.getElementById('title').innerText = getMarkovText(markovTitles);
	document.getElementById('image').innerHTML = imageSrc;
	
	setAppName();
}

function getOffset(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

function setAppName() {
	let i = Math.floor(Math.random() * 5) + 2;
	const realFake = ['Real', 'Fake'];

	document.getElementById('app-name').innerText = '';
	while (i > 0) {
		document.getElementById('app-name').innerText += `${realFake[Math.random() > 0.5 ? 0 : 1]} `; 
		i -= 1;
	}
	document.getElementById('app-name').innerText += ' News';
}