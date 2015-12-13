$(document).ready(function(){
	var ratings = $('.rating');
	var rating;

	for(var i = 0; i < ratings.length; i++){
		
		var rating = ratings[i];
		var allRatings = $(rating).data("rating");
		var ratingCount = $(rating).data("count") || 1;
		var ratingValue = Math.floor(allRatings/ratingCount);
		var alreadyVoted = $(rating).data("vote");

		$(rating).barrating('show',{
			theme:'bars-reversed',
			readonly: !alreadyVoted,
			initialRating: ratingValue > -1? ratingValue: null,
			onSelect: function(value, text, event){
				if (typeof(event) !== 'undefined') {
					var anchor = event.target;
					var id = $($(anchor).parent().siblings()[0]).data("id");
					var count = $($(anchor).parent().siblings()[0]).data("rating_id");

					ajax('post', '/add-rating', {id:id, ratingVal:value}, function(response){
						var rating = ratings[count];
						console.log(response);
						if(response == "e"){
				      		$(rating).barrating('set', ratingValue);
						}else if(response == "already_v"){
				      		$(rating).barrating('set', ratingValue);
						}else{
							$(rating).barrating('set', Math.floor((value+ratingCount)/ratingValue));
						}
					});
				} else {
					// rating was selected programmatically
					// by calling `set` method
				}
			}
		});
		
		$(rating).barrating('set', ratingValue);
	}
		
		
});