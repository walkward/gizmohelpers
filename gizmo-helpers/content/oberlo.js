import $ from 'jquery';

export default function() {

  // Next page and previous page events (dispatched from background)
  chrome.extension.onMessage.addListener(function(msg) {
    var page = window.location.search.split('=');
    var nextPage = parseInt(page[1], 10) + 1;
    var prevPage = parseInt(page[1], 10) - 1;
    switch (msg.action) {
      case "prev-page":
        window.location.replace(window.location.origin + '/import' + "?page=" + prevPage);
        break;
      case "next-page":
        window.location.replace(window.location.origin + '/import' + "?page=" + nextPage);
        break;
    }
  });

  // Selecting the initial product panel
  $(document).ready(function() {
    $('.tabs').first().css("border", "2px solid black");
    $('.tabs').first().addClass('active-product-panel');
  });

  // Adding an data-panel-index for each product panel
  $('.main-content .tabs').each(function(index) {
    $(this).attr('data-panel-index', index);
  });

  // Event listener for when users click a product panel
  $('.tabs').on('click', function(){
    $('.tabs').css("border", "0px solid black");
    $('.tabs').removeClass('active-product-panel');
    $(this).first().css("border", "2px solid black");
    $(this).first().addClass('active-product-panel');
  });

  // Handles down arrow by selecting next product panel
  function selectNext() {
    var index = parseInt($(".active-product-panel").attr('data-panel-index'), 10) + 1;
    selectPanel(index);
  }

  // Handles up arrow by selecting next product panel
  function selectPrev() {
    var index = parseInt($(".active-product-panel").attr('data-panel-index'), 10) - 1;
    selectPanel(index);
  }

  function selectPanel(index){
    $(".active-product-panel").css("border", "0px solid black");
    $(".active-product-panel").removeClass('active-product-panel');
    if (index >= 0) {
      $('[data-panel-index="' + index + '"]').addClass('active-product-panel');
      $('[data-panel-index="' + index + '"]').css("border", "2px solid black");
      $('html,body').animate({
        scrollTop: $('[data-panel-index="' + index + '"]').offset().top - 70
      }, 'fast');
    }
  }

  function deleteProduct(){
    var index = parseInt($(".active-product-panel").attr('data-panel-index'), 10) + 1;
    $(".active-product-panel").find('.dropdown-menu > ul > li').last().find('a').attr('id', 'doomedEl');
    document.getElementById("doomedEl").click();
    setTimeout(function(){
      selectPanel(index);
    }, 500);
  }

  // Focus on next tab within active-product-panel
  function focuNextTab(){
    // var el = $('.active-product-panel').find('li.active').next('li').find('a');
    document.querySelector('.active-product-panel .nav-tabs > li.active + li > a').click();
    // $( ":focus" ).next
  }

  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 38:
        selectPrev();
        break;
      case 39:
        focuNextTab();
        break;
      case 40:
        selectNext();
        break;
      case 8:
        deleteProduct();
        break;
    }
  };

}
