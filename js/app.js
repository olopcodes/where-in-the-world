
$(document).ready(function () {
    // variables
    const filterButtonEl = $('.world-filter-button');
    const filterRegionListEl = $('.world-region-list');
    let numberOfCountries = 250;
    const worldResults = $('.world-results');
    const worldRegionList = $('.world-region-list');

    let countryDetailsPage = new URL("https://that.example.com/path/page");
    let thisPage = new URL(document.location)
    let numberOfCountriesToShow = 0;
    let randomIndexes = [];
    const countriesShown = [];

    // show the regoin list
    $(filterButtonEl).click(function (e) { 
        $(filterRegionListEl).slideToggle();
    });

    $(worldResults).click(function (e) { 
        e.preventDefault();
       
        if($(e.target).hasClass('world-learn-more-button')) {
        setTimeout(window.location.replace("./country-details.html"), 3000);

            const divID = $(e.target).closest('div').attr('id');
            getCountriesByCategory('alpha',divID, renderCountryDetails)
            
        }

        
    });

    // pass info to another page
    // set your data in the source page 
function set_url_data(go_to_url, data) {
    new_url = go_to_url + '?data=' + data;
    window.location.href = new_url;
  }
  
  // parse your data in the destination page 
  function grab_data_from_url() {
    url = window.location.href;
    data = url.split('data=').pop();
    return(data)
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

    function renderCountryDetails(data) {
        console.log(data)
        // renderCountryDetails(data);
    }

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

    function countryDetailsHTML (data) {
        console.log(data, 'deatils')
        let bordersHTML = ''
        for(const b of data.borders) {
            bordersHTML += `
            <a id="${b}" class="country-border-link" href="#">${b}</a>
            `
        }

        let langs = [];

        for(const prop in data.languages) {
            langs.push(`${data.languages[prop]}`)
        }

        return `
        
            <div class="country-flag">
                <img src="${data.flags.png}" alt="">
            </div>

            <div class="country-stats">
                <h2 class="world-country-name">${data.name.common}</h2>
                <div class="country-stats-box-1">
                    <p id="country-native" class="world-description-text">Native Name: <span>${data[0].name.nativeName.eng}</span></p>
                    <p id="country-pop" class="world-description-text">population: <span>${data.population}</span></p>
                    <p id="country-region" class="world-description-text">region:<span> ${data.region}</span></p>
                    <p id="country-sub-region" class="world-description-text">sub region: <span>${data.subregion}</span></p>
                    <p id="country-capital" class="world-description-text">capital: <span>${data.capital}</span></p>
                </div>
                <div class="country-stats-box-2">
                    <p id="country-domain" class="world-description-text">top level domain: <span>${data.tld}</span></p>
                    <p id="country-currency" class="world-description-text">currency: <span>${data.currencies.DOP}</span></p>
                    <p id="country-lang" class="world-description-text">languages:<span> ${langs.join(' ,')}</span></p>
                </div>
                <div class="country-border-box">
                    <p class="world-description-text">Border countries</p>
                    <div class="country-borders">
                        ${bordersHTML}
                    </div>
                    
                </div>
             </div>
       
        `
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


