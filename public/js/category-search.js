$(document).ready(function() {
	var categories = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote:{
			url:'/api/category-search/?q=%QUERY',
			wildcard: '%QUERY'
		}
	});
	$('.category-search').typeahead(null,{
		name: 'category-search',
		display: 'title',
		source: categories
	});

});