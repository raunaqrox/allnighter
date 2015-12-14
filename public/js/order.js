$(document).ready(function(){
	$('.confirm-order').on('click', function(){
		var postData = {};
		postData.phone = $('#phone').val();
		postData.address = $('#address').val();
		ajax('post', '/send-order', postData, function(response){
			if(response){
				window.location = "/sent";
			}
		});
	});
});