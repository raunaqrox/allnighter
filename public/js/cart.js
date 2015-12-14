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

function showInCart(qty, name, price, id){
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
    items.append("<div class='well'><h3> " +name+ "<button class='remove close-btn pull-right'>✕</button></h3><h3 class='name hide' data-id='"+id+"'>"+name+"</h3><br><h4 class='inline-label'>Price : </h4><h4 class='price inline-label'>"+price+"</h4><br><h4 class='inline-label'>Quantity : </h4><h4 class='qty inline-label'>"+qty+"</h4><br><button class='add btn btn-primary'> + </button>&nbsp<button class='subtract btn btn-danger'> - </button></div>");
    
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
    postData.items[i].price = parseInt($(this).children('.price').text());
    postData.items[i].id = $(this).children('.name').data("id");
    i+=1;
  });
  if(typeof(Storage) !== "undefined") {
    console.log(postData.items);
    localStorage.setItem('items', JSON.stringify(postData.items));
  }
    ajax('post', '/order', postData, function(response){
        if(response){
          window.location = "/order";
        }
    });

}

$(document).ready(function(){
  var addToCart = $('.cart');

  addToCart.on("click", function(e){
    var quantity = $(this).parents('.caption').children('.qty').val();;
    var name = $(this).parents('.caption').children('.name').text();
    var price = $(this).parents(".caption").children(".price").text();
    var id = $(this).parents('.caption').children('.name').data("id");
    if(quantity && name && price && id){
      showInCart(quantity, name, price, id);
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
      sendData();
  });
    if(typeof(Storage) !== "undefined") {
      var items = JSON.parse(localStorage.getItem('items'));
      if(items){
        for(var i = 0; i < items.length; i++){
          var item = items[i];
          showInCart(item.qty, item.name, item.price, item.id);
        }
      }
  }
});