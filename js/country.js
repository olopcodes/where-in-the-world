$(document).ready(function () {
    const countryBordersBoxEl = $('.country-borders');
    const countryBoxEl = $('.country-box');

    countryBoxEl.click(function(e) {
        if($(e.target).hasClass('country-border-link')) {
            const id = $(e.target).closest('button').attr('id');
            updateUrlInfo(id)
        }
    })

    

    // parse your data in the destination page 
    function getDataFromUrl() {
        url = window.location.href;
        data = url.split('data=').pop();
        return(data)
    }

    function updateUrlInfo(id) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('data', id);
        window.location.search = searchParams.toString();
        
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

  function countryDetailsHTML (data) {
    console.log(data, 'deatils')
    let bordersHTML = ''

    if(data.borders) {
        for(const b of data.borders) {
            bordersHTML += `
            <button id="${b}" class="country-border-link" href="#">${b}</button>
            `
        }
    } 
    // console.log(data.borders.length, 'bor')
    

    let langs = [];

    for(const prop in data.languages) {
        langs.push(`${data.languages[prop]}`)
    }

    let currency = '';

    for(const prop in data.currencies) {
        currency = data.currencies[prop].name
    }
    
    console.log(currency, 'cur')
    return `
    
        <div class="country-flag">
            <img src="${data.flags.png}" alt="">
        </div>

        <div class="country-stats">
            <h2 class="world-country-name">${data.name.official}</h2>
            <div class="country-stats-box-1">
                <p id="country-native" class="world-description-text">Native Name: <span>${data.name.common}</span></p>
                <p id="country-pop" class="world-description-text">population: <span>${numberWithCommas(data.population)}</span></p>
                <p id="country-region" class="world-description-text">region:<span> ${data.region}</span></p>
                <p id="country-sub-region" class="world-description-text">sub region: <span>${data.subregion}</span></p>
                <p id="country-capital" class="world-description-text">capital: <span>${data.capital}</span></p>
            </div>
            <div class="country-stats-box-2">
                <p id="country-domain" class="world-description-text">top level domain: <span>${data.tld[0].toLowerCase()}</span></p>
                <p id="country-currency" class="world-description-text">currency: <span>${currency}</span></p>
                <p id="country-lang" class="world-description-text">languages:<span> ${langs.join(' , ')}</span></p>
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

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function renderCountryDetails(data) {
            // console.log(data)
            let html = countryDetailsHTML(data[0]);

            $(countryBoxEl).html('');

            $(countryBoxEl).append(html);
            // renderCountryDetails(data);
        }

        function getThemeFromLocalStorage () {
            return theme = JSON.parse(localStorage.getItem('theme'));
        }

        (function () {
            const id = getDataFromUrl()
            getCountriesByCategory('alpha',id, renderCountryDetails)
            
            const theme = getThemeFromLocalStorage();

            if(theme === 'light-theme') {
                $('body').attr('id', 'dark-theme');
                theme = 'dark-theme'
            } else {
                $('body').attr('id', 'light-theme');
                theme = 'light-theme';
            }

        })();
});