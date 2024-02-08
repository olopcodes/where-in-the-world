// variables
const filterButtonEl = $('.world-filter-button');
const filterRegionListEl = $('.world-region-list');

// show the regoin list
$(filterButtonEl).click(function (e) { 
    $(filterRegionListEl).slideToggle();
});


