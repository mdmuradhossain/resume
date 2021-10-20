var isDropDownShowing = false;

/**
 * Find the x/y offsets given the scroll of the page, etc.
 */
function getScrollOffsets() {
  var doc = document,
    w = window;
  var x, y, docEl;

  if (typeof w.pageYOffset === "number") {
    x = w.pageXOffset;
    y = w.pageYOffset;
  } else {
    docEl =
      doc.compatMode && doc.compatMode === "CSS1Compat"
        ? doc.documentElement
        : doc.body;
    x = docEl.scrollLeft;
    y = docEl.scrollTop;
  }
  return { x: x, y: y };
}

function hideDropDown() {
  isDropDownShowing = false;
  $(".techrez-dropdown-menu").hide();
  $(".profile-menu-container").removeClass("show");
}

$(document).ready(function () {
  $(".profile-menu-container").click(function (e) {
    if (isDropDownShowing) {
      hideDropDown();
    } else {
      let sOff = getScrollOffsets();
      let top = e.clientY + sOff.y + 25;
      isDropDownShowing = true;
      $(".techrez-dropdown-menu").show();
      $(".techrez-dropdown-menu").css("top", top);
      $(".profile-menu-container").addClass("show");
    }
    e.stopPropagation();
  });

  $(window).click(function () {
    hideDropDown();
  });

  $(window).scroll(function () {
    hideDropDown();
  });
});
