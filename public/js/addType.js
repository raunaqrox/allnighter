$(document).ready(function(){
	$('#type').on('click change', function(){
		var selectedType = $('#type').val();
		if(selectedType === 'new'){
			$('.newType').css({'display': 'inline'});
		}else{
			$('.newType').css({'display': 'none'});
		}
	});
	$('.add-type').on('click', function(e){
		var type = $($('.type-search')[1]).val();
		addTypeRequest(type);
		e.preventDefault();
		return false;
	});

	function addTypeRequest(type){
		$.get('/add-type', {type:type}, function(data){
			if(data === 'e'){
				console.log('error');
			}else{
				$('#newTypeOption').before($('<option>',{
					value: data._id,
					text: data.title
				}));
				$('#type').val(data._id).change();
			}
		});
	}


	var types = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote:{
			url:'/api/type-search/?q=%QUERY',
			wildcard: '%QUERY'
		}
	});
	$('.type-search').typeahead(null,{
		name: 'type-search',		
		display: 'title',
		source: types
	});
});