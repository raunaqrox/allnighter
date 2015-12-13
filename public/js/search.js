$(document).ready(function(){
	var links = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote:{
			url:'/api/link-search/?q=%QUERY',
			wildcard: '%QUERY'
		}
	});
	$('.link-search').typeahead(null,{
		name: 'link-search',
		display: 'title',
		templates: {
			suggestion: function(data){
				return "<h4><a target='_blank' href='"+data.url+"'>"+data.title+"</a></h4>";
			}
		},
		source: links
	}).on('typeahead:selected typeahead:autocompleted', function($e, datum){
		// nothing as of now
		console.log(datum);
	});

});