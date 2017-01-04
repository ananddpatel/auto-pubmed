var urlInput = $('#urlinput');
var addbibBtn = $('#addbib')
var bib = $('#bib');
var pubmedAPIUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';

addbibBtn.click(function(){
	var id = getArticleId(urlInput.val());
	console.log(id)
	searchPubmed(id);
	console.log('searching...')

})

function getArticleId(pubmedUrl){
	var pid = pubmedUrl.split('/');
	var last = pid.length - 1;
	return pid[last];
}

function searchPubmed(articleID){
	var xhttp = $.ajax({
		url: pubmedAPIUrl,
		type: 'GET',
		data: {
			db: 'pubmed',
			id: articleID,
			retmode: 'json'
		},
		success: function(data){
			// console.log(data)
			parseData(data);
		},
		error: function(jqXHR, textStatus, error){
			console.log(error)
		}
	});
}

function parseData(jsonData){
	//GILL, M.S., MCLEOD, A.J. and MOREAU, M. 1984. Volatile compenents of
// cocoa with particular reference to glucosinolate product. Phytochemistry
// 23, 1937–1942.
	var text, authors, publicationYear, articleTitle, journalTitle, volume, issue, pgNum;

	text = authors + '. (' + publicationYear + '). ' + articleTitle + '. ' + journalTitle + ', ' + volume + '(' + issue + '), ' + pgNum + '.\n\n';

	addbib(text);
}

function addbib(formatedBibliography){
	bib.append(formatedBibliography);
}