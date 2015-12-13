var modal = null;
$(document).ready(function(){
	$('.fa-remove').on('click', function(event){
		if(modal){
			modal.modal();
			modalHeader('Are you sure?');
			deleteBody();
		}
	});

	$('.fa-edit').on('click', function(event){
		if(modal){
			modal.modal();
			modalHeader('Edit');
			addId($(this).parent().parent().data("id"));
			addTitle($(this).parent().siblings('.title').text());
			addUrl($(this).parent().siblings('.title').attr("href"));
			addSaveButton();
		}
	});

});

function createBootModal(){
	modal = $(
	'<div class="modal">'+
	  '<div class="modal-dialog">'+
	    '<div class="modal-content">'+
	      '<div class="modal-header">'+
	      '</div>'+
	      '<div class="modal-body">'+
	      '</div>'+
	      '<div class="modal-footer">'+
	     ' </div>'+
	    '</div>'+
	  '</div>'+
	'</div>');

	$('body').append(modal);
}

function modalHeader(title){
	$('.modal-header').html('<h4 class="modal-title">'+ title +'<button class="btn btn-danger pull-right" data-dismiss="modal">X</button></h4>');
}

function addToBody(html){
	$('.modal-body').append(html);
}

function deleteBody(){
	$('.modal-body').html('');
}

function addId(id){
	$('.modal').attr('data-id', id);
}

function addTitle(title){
	addToBody("<input type='text' class='title' value='" + title + "'>");
}

function addUrl(url){
	addToBody("<input type='text' class='url' value='" + url + "'>");
}

function addSaveButton(){
	addToBody('<button id="save" class="btn btn-danger" data-dismiss="modal">Save</button>');
}

function extractData(){
	var data = {};
	data.id = $('.modal').data("id");
	data.url = $('.modal-body').children('.url').val();
	data.title = $('.modal-body').children('.title').val();
	// also check if there is any change, if not then don't make ajax request
	if(!data.title || !data.url){
		return false;
	}
	return data;
}

$('body').on('click', '#save', sendChanges);

function sendChanges(){
	var postData;
	if(postData = extractData()){
		ajax('post', '/update-link', postData, function(response){
			if(response!=="e"){
				location.reload();
			}
		});
	}else{
		// show error, that it is empty
	}
}

createBootModal();