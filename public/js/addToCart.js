var myCart = {};

var addToCart = $('.cart');
addToCart.on("click", function(e){
  // var getFood = $('#getFood');
  var price = $(this).siblings('.price').innerText;
  console.log("hey");
  // if(getFood.css("display") == "none"){
  //   getFood.css("display","inline-block");
  // }
  var quantity = 1;
  // var id = $(this).parent().data("id");
  var name = $(this).siblings()[0].innerText;
  // ajax('post', '/', {"quantity":quantity, "itemId":id , "ItemName":name}, function(response){
  //   showInCart(response.id, response.qty, name, price);
  // });
  showInCart(1, quantity, name, price);
});

function showInCart(id, quantity, name, price){
  $('.myCart').append('<div><h2>'+name+'</h2><h3>quantity : '+quantity+'</h3></div>');
  changePrice(price * quantity);
}

function changePrice(price){
  var total = parseInt($('#total').text());
  if(total){
    total += price;
    $('#total').text(total);
  }else{
    $('#total').text(price);
  }
}
