function ajax(type, url, postData, callback){
	$.ajax({
			url: url,
			type: type,
			data: postData,
			headers: {
			'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
		},
		success: callback
	});
}