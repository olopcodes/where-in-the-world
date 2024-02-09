
$(document).ready(function () {
    // variables
    const filterButtonEl = $('.world-filter-button');
    const filterRegionListEl = $('.world-region-list');

    // show the regoin list
    $(filterButtonEl).click(function (e) { 
        $(filterRegionListEl).slideToggle();
    });

    function getAllCountries () {
        $.ajax({
            method: "GET",
            url: "https://restcountries.com/v3.1/all",
            success: function (data) {
                console.log(data)
            },
            error: function (err) { 
                console.log(err)
             }
        });
    }

    function getCountriesByCategory(cat) {
        $.ajax({
            method: "GET",
            url: `https://restcountries.com/v3.1/${cat}/${cat}`,
            success: function (data) {
                console.log(data)
            },
            error: function (err) { 
                console.log(err)
             }
        });
    }
    
    getCountriesByRegion('europe')
});


