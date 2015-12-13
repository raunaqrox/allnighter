$(document).ready(function (){

	var editor;
	
	function sendComment (mySelector, id, isReply){
		var postData = getPostData(mySelector, id);
		postData.isReply = isReply;
		ajax('post', '/add-comment', postData, function(response){
			if(response === 'e'){
				console.log('error');
			}else{
				if(!isReply){
					addComment(postData.body, postData.topic);
				}else{
					addReply(postData.body, postData.topic);
				}
			}
		});
	}

	function getPostData(mySelector, id){
		var body = $(mySelector).html();
		console.log(id);
		if(body){
			return {
				'body': body,
				'topic': id,
				'addedOn': new Date()
			};
		}else{
			console.error("error getting html from editor");
			return false;
		}
	}

	function Reply(id, elem){
		this.id = id;
		this.createNewDiv(id, elem);
		this.editor = new MediumEditor($('.editableReply')[0]);
		showEditor(elem, '.editableReply');
	}
	Reply.prototype.createNewDiv = function(id, elem){
		$(elem).parent().append('<div class="editableReply '+id+'"></div>')[0];
	}

	function addComment(body, id){
		if(body){
			//$('.comments').prepend("<br /><hr>"+ body +"<button class='btn pull-right replyButton' data-id="+id+" >Discuss</button>");
			location.reload();
		}
	}

	function addReply(body, id){
		//$('div[data-id='+id+']').append("<br /><hr>"+ body +"<button class='btn pull-right replyButton' data-id="+id+" >Discuss</button>");
		location.reload();
	}

	function init (){
		editor = new MediumEditor('.editable');
	}

	function showEditor(that, mySelector){
		$(mySelector).css('display', 'block');
		init();
		$(mySelector).focus();
		$(that).text("Add");
	}

	function hideEditor(that, mySelector, id, isReply){
		$(that).text("Discuss");
		sendComment(mySelector, id, isReply);
		$(mySelector).css('display', 'none');
		editor.destroy();
	}

	$('.discuss').on('click', function (){
		if($(this).text() === "Discuss"){
			showEditor(this, '.editable');
		}else{
			hideEditor(this, '.editable', window.location.href.split("/")[4].split("/")[0]);
		}
	});

	$('.comments').on('click', '.replyButton', function(){
		var reply, id;
		if(!$('.editableReply').length){
			if($(this).text() === "Discuss"){
				console.log($(this).text());
				id = $(this).data("id");
				// id = id.substr(1, id.length-2);
				reply = new Reply(id , $(this));
			}
		}else{
			if($(this).text() === "Add"){
				id = $(this).data("id");
				if(id[0]=='"' && id[id.length-1]=='"'){
					id = id.substr(1, id.length-2);
				}
				hideEditor(this, '.editableReply', id, true);
				$('.editableReply').remove();
			}
		}
	});
});