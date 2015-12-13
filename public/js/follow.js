$(document).ready(function(){
	var followBtn = $('#follow');
	var unfollowBtn = $('#following');
	followBtn.on('click', function(e){
		var id = $(this).data("id");
		ajax('post', '/follow', {"id":id}, function(response){
			if(response == "done"){
				//$(this).text("following");
				// $(this).attr("id", "following");
				location.reload();
			}else if(response == "e"){
				// didn't follow
				alert("error following");
			}
		});
	});
	unfollowBtn.on('click', function(e){
		var id = $(this).data("id");
		ajax('post', '/unfollow', {"id":id}, function(response){
			if(response == "done"){
				// $(this).text("follow");
				// $(this).attr("id", "follow");
				location.reload();
			}else if(response == "e"){
				// didn't follow
				alert("error following");
			}
		});
	});
});