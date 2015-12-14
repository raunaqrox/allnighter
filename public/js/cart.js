function checkNotNull(value){
  if(value){
    return true;
  }
  return false;
}

function validate(value){
  if(checkNotNull(value)){
    if(parseInt(value) >= 0){
      return true;
    }
  }
  return false;
}


function updateQty(qty, amt){
  if(qty){
    qty.text(parseInt(qty.text()) + parseInt(amt));
    updatePrice();
  }
}

function showInCart(qty, name, price){
  var myCart = $('.myCart');
  var items = $('.myCart > .items');
  var names = $('.myCart > .items .name');
  var toAppend = true;
  names.each(function(){
    if($(this).text() == name){
      updateQty($(this).siblings('.qty'), qty);
      toAppend = false;
    }
  });
  if(toAppend){
    items.append("<div class='well'><button class='remove btn btn-danger'>X</button></br><h5 class='name'>"+name+"</h5><h5>Quantity : </h5><h5 class='qty'>"+qty+"</h5><h5>Price : </h5><h5 class='price'>"+price+"</h5><button class='add btn btn-primary'> + </button>&nbsp<button class='subtract btn btn-danger'> - </button></div>");
    updatePrice();
  }
}

function updatePrice(){
  var total = 0;
  $('.myCart > .items > .well').each(function(){
    var qty = parseInt($(this).children('.qty').text() || 1);
    var cost = parseInt($(this).children('.price').text());
    total += qty*cost;
  });
  $('.myCart > .total').html("Total : "+total);
}


function sendData(){
  var postData = {};
  postData.items = [];
  var i = 0;
  $('.myCart > .items > .well').each(function(){
    postData.items[i] = {};
    postData.items[i].name = $(this).children('.name').text();
    postData.items[i].qty = parseInt($(this).children('.qty').text());
    postData.items[i].cost = parseInt($(this).children('.price').text());
    i+=1;
  });
    ajax('post', '/', postData, function(response){
        if(response){
          window.location = "/confirmation";
        }
    });

}

$(document).ready(function(){
  var addToCart = $('.cart');

  addToCart.on("click", function(e){
    var quantity = $(this).parents('.caption').children('.qty').val();;
    var name = $(this).parents('.caption').children('.name').text();
    var price = $(this).parents(".caption").children(".price").text();
    if(quantity && name && price){
      showInCart(quantity, name, price);
    }
  });

  $('.myCart > .items').on('click', '.subtract', function(){
    var qty = $(this).siblings('.qty');
    if(qty && (parseInt(qty.text()) > 1)){
      updateQty(qty, -1);
    }else{
    }
  });

  $('.myCart > .items').on('click', '.add', function(){
    var qty = $(this).siblings('.qty');
    updateQty(qty, 1);
  });

  $('.myCart > .items').on('click', '.remove', function(){
    $(this).parent().remove();
    updatePrice();
  });
  $('.getFood').on('click', function(){
      // sendData();
  });
});