
$(document).ready(function () {
    // variables
    const filterButtonEl = $('.world-filter-button');
    const filterRegionListEl = $('.world-region-list');
    let numberOfCountries = 250;
    const worldResults = $('.world-results');
    const worldRegionList = $('.world-region-list');
    const refreshBtn = $('.btn-refresh');

    let countryDetailsPage = new URL("https://that.example.com/path/page");
    let thisPage = new URL(document.location)
    let numberOfCountriesToShow = 0;
    let randomIndexes = [];
    const countriesShown = [];

    $(refreshBtn).click(function(e) {
        location.reload();
    })
    

    // show the regoin list
    $(filterButtonEl).click(function (e) { 
        $(filterRegionListEl).slideToggle();
    });

    $(worldResults).click(function (e) { 
        e.preventDefault();
       
        if($(e.target).hasClass('world-learn-more-button')) {
            const divID = $(e.target).closest('div').attr('id');
            set_url_data("./country-details.html", divID)
        }

        
    });

    // pass info to another page
    // set your data in the source page 
    function set_url_data(go_to_url, data) {
        new_url = go_to_url + '?data=' + data;
        window.location.href = new_url;
    }
  

    // show random countries in region clicked
    $(worldRegionList).click(function(e) {
        // remove active class
        $('.world-list-item').removeClass('active');

        // add active class
        $(e.target).closest('li').addClass('active');
        const id = $(e.target).closest('li').attr('id');
         getCountriesByCategory('region', id, showRegionCountries)
        
    })

    

    function showRegionCountries(data) {

        // add indexs in the array
        getRandomIndexes();

        // filter countries
        const filtered = filterCountries(data);

        // render countries in dom
        renderCountries(filtered)
    }

    function randomNumber () {
        return (Math.floor(Math.random() * numberOfCountries)) // 0 to 249
    }
    
    function getAllCountries () {
        $.ajax({
            method: "GET",
            url: "https://restcountries.com/v3.1/all",
            success: function (data) {
                // console.log(data)
                handleCountriesInIndex(data)
            },
            error: function (err) { 
                console.log(err)
             }
        });
    }

    
    function renderCountries (arr) {
        let html = '';

        $.each(arr, function (indexInArray, valueOfElement) { 
            html += getCardHTML(valueOfElement);
       });

       $(worldResults).html('');

       $(worldResults).append(html);
    }

    function getCountriesByCategory(cat, name, cb) {
        $.ajax({
            method: "GET",
            url: `https://restcountries.com/v3.1/${cat}/${name}`,
            success: function (data) {
                cb(data);
            },
            error: function (err) { 
                console.log(err)
             }
        });
    }

    function filterCountries (data) {
        return data.filter((item, index) => {
            if(randomIndexes.includes(index)) {
                return item
            }
        })
    }
    
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function handleCountriesInIndex (data) {

        const filtered = filterCountries(data);    

        renderCountries(filtered)
    }

    function getCardHTML (data) {
        console.log(data)
        return `
        <div class="world-card" id="${data.cca2}">
                        
            <img src="${data.flags.png}" alt="" class="world-img-flag">

            <div class="world-card-text-body">
            <h3 class="world-country-name">${data.name.common}</h3>
            
            <p id="world-population" class="world-description-text">Population: <span class="world-population-num">${numberWithCommas(data.population)}</span></p>

            <p id="world-region" class="world-description-text">Region: <span class="world-region-name">${data.region}</span></p>
            <p id="world-capital" class="world-description-text">Capital: <span class="world-capital-name">${data.capital}</span></p>
            </div>
            <button class="world-learn-more-button">learn more <i class="fa-solid fa-arrow-right-long"></i></button>
        </div> `;
    }

    function getRandomIndexes () {
        randomIndexes = [];

        for(let i = 0;  randomIndexes.length < 8; i++) {
            const index = randomNumber();
            if(randomIndexes.indexOf(index) === -1) {
                randomIndexes.push(index)
            }  
        }
    }

    
    
    (function () {
        

        getRandomIndexes();

        getAllCountries()
    })();
});


