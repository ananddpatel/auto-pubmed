var urlInput = $('#urlinput');
var addbibBtn = $('#addbib')
var bib = $('#bib');
var pubmedAPIUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
var contact = $('#contact');

contact.click(function(){
	$('#contactModal').load('contact.html')
});

addbibBtn.click(function(){
	if (urlInput.val()) {
		var id = getArticleId(urlInput.val());
		searchPubmed(id);
	}
});

function getArticleId(pubmedUrl){
	// parses the url for the article ID
	var pid = pubmedUrl.split('/');
	var last = pid.length - 1;
	return pid[last];
}

function searchPubmed(articleID){
	// makes request to the pubmed E-utilities API and gets the JSON data of the article
	var xhttp = $.ajax({
		url: pubmedAPIUrl,
		type: 'GET',
		data: {
			db: 'pubmed',
			id: articleID,
			retmode: 'json'
		},
		success: function(data){
			parseData(data, articleID);
		},
		error: function(jqXHR, textStatus, error){
			console.log(error)
		}
	});
}

function parseData(jsonData, articleID){
	// parses the json data for relavant bibliography information
	var text, authors, publicationYear, articleTitle, journalTitle, volume, issue, pages;

	articleData = jsonData['result'][articleID];

	authors = parseAuthors(articleData['authors']);
	publicationYear = articleData['pubdate'].split(' ')[0]
	articleTitle = articleData['title']
	// removes the period at the end of some article title names
	if (articleTitle.charAt(articleTitle.length-1) == '.'){
		articleTitle = articleTitle.slice(0, -1)
	};

	journalTitle = articleData['fulljournalname']
	volume = articleData['volume']
	issue = articleData['issue']
	pages = articleData['pages']

	text = authors + '. (' + publicationYear + '). ' + articleTitle + '. ' + journalTitle + '. ' + volume + '(' + issue + '): ' + pages + '.\n\n';

	addbib(text);
}

function parseAuthors(authorsList){
	var authors = [];
	var iAuths = 0;
	for (; iAuths < authorsList.length; iAuths++) {
		authors.push(authorsList[iAuths].name);
	};
	authors = authors.join('., ');
	return authors;
}

function addbib(formatedBibliography){
	bib.append(formatedBibliography);
}