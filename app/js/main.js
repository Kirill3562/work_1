$(function(){

  $('.new-products__items').slick({
   slidesToShow: 2,
   infinite: false,
   variableWidth: true,
   arrows: false,
  });


  $('.product-slide__big').slick({
    asNavFor:'.product-slide__thumb',
    arrows: false,
  });

  $('.product-slide__thumb').slick({
    nfinite: true,
    asNavFor:'.product-slide__big',
    focusOnSelect: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    draggable: false,
    variableWidth: true,
  });


});