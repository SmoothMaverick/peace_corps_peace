/**
 * Created by nmew on 6/1/14.
 */

window.PC = window.PC ? window.PC : {};

PC.jsrUrl = "http://opendata.socrata.com/resource/2nwa-frvc";
PC.medicalUrl = "PC.medicalUrl";

PC.sectors = [];
PC.countries = [];
PC.languages = [];
PC.wishlist = [];
PC.countryMedicalIssues = [];
PC.projectStartDates = [];

PC.loadSectors = function() {
    $.ajax({
        url: PC.jsrUrl + ".csv?$select=title&$group=title"
    }).done(function(text) {
        var tmpsectors = text.split("\n");
        for(var i=1; i<tmpsectors.length; i++) {
            if(tmpsectors[i].trim() !== "" ) {
                PC.sectors.push(tmpsectors[i]);
            }
        }
    });
};

PC.loadCountries = function() {
    $.ajax({
        url:  PC.jsrUrl + ".csv?$select=country_post&$group=country_post"
    }).done(function(text) {
        var tmp = text.split("\n");
        for(var i=1; i<tmp.length; i++) {
            if(tmp[i].trim() !== "" ) {
                PC.countries.push(tmp[i]);
            }
        }
    });
};

PC.loadLanguages = function() {
    $.ajax({
        url:  PC.jsrUrl + ".csv?$select=language_requirement_lang_skills&$group=language_requirement_lang_skills"
    }).done(function(text) {
        var tmp = text.split("\n");
        for(var i=1; i<tmp.length; i++) {
            if(tmp[i].trim() !== "" ) {
                PC.languages.push(tmp[i]);
            }
        }
    });
};

PC.loadProjectStartDates = function() {
    $.ajax({
        url:  PC.jsrUrl + ".csv?$select=staging_start_date_staging_start_date&$group=staging_start_date_staging_start_date&$order=staging_start_date_staging_start_date ASC"
    }).done(function(text) {
        var tmp = text.split("\n");
        for(var i=1; i<tmp.length; i++) {
            if(tmp[i].trim() !== "" ) {
                PC.projectStartDates.push(new Date(tmp[i]));
            }
        }
    });
};

PC.loadCountryMedicalIssues = function() {
    $.ajax({
        url: PC.medicalUrl + ".json"
    }).done(function(countryMedicalIssues) {
        PC.countryMedicalIssues = countryMedicalIssues;
    });
};

PC.filterCountriesWithMedicalIssues = function(arrayOfIssues, countries) {
    countries = countries ? countries : PC.countries;
    var countriesWithoutTheIssues = [];
    var countriesToRemove = [];
    // find all countries with the issues
    for(var countryIndex in PC.countryMedicalIssues) {
        if(PC.countryMedicalIssues.hasOwnProperty(countryIndex)) {
            var countryObject = PC.countryMedicalIssues[countryIndex];
            for(var i=0; i<arrayOfIssues.length; i++) {
                // if country has issues
                if(countryObject.text.indexOf(arrayOfIssues[i]) != -1) {
                    countriesToRemove.push(countryObject.country);
                }
            }
        }
    }
    // find countries that have no issues
    for(var i=0;i<countries.length; i++) {
        // if this country has no issues, add it to our list
        if(countriesToRemove.indexOf(countries[i]) == -1) {
            countriesWithoutTheIssues.push(countries[i]);
        }
    }

    return countriesWithoutTheIssues;
};

PC.getFilteredPosts = function(selectedCountries, earliestStartDate, sectors, medicalIssues) {
    var countryQuery = '';
    var sectorsQuery = '';
    var startDateQuery = '';

    // filter selected countries by medical issues if neccessary
    if(selectedCountries && selectedCountries.length > 0) {
        if(medicalIssues) {
            selectedCountries = PC.filterCountriesWithMedicalIssues(medicalIssues, selectedCountries);
        }
    } else {
        if(medicalIssues) {
            selectedCountries = PC.filterCountriesWithMedicalIssues(medicalIssues);
        }
    }

    // create country query string
    if(selectedCountries && selectedCountries.length > 0) {
        countryQuery = "(";
        for(var i=0; i<selectedCountries.length; i++) {
            if(i > 0) {
                countryQuery += " OR ";
            }
            countryQuery += "country_post = '" + selectedCountries[i] + "'";
        }
        countryQuery += ")";
    }

    // create sectors query string
    if(sectors && sectors.length > 0) {
        sectorsQuery += "(";
        for(var i=0;i<sectors.length;i++) {
            if(i > 0) {
                sectorsQuery += " OR ";
            }
            sectorsQuery += "title = '" + sectors[i] + "'";
        }
        sectorsQuery += ")";
    }

    // create startDate query string
    if(earliestStartDate) {
        startDateQuery = "(staging_start_date_staging_start_date > '" + earliestStartDate.toISOString() + "')";
    }

    var isNotEmpty = function(element) {
        return element.trim() !== '';
    };

    // put query strings together
    var queryString = [countryQuery, sectorsQuery, startDateQuery]
        .filter(isNotEmpty)
        .join(' AND ');
    queryString = queryString.trim() === '' ? '' : "$where=" + queryString;
    console.log(queryString);
    // make ajax call
    var promise = $.ajax({
        url:  PC.jsrUrl + ".json?" + queryString,
        crossDomain: true
    });

    // return deferred result, see jquery ajax method for details
    return promise;
};


PC.loadSectors();
PC.loadCountries();
PC.loadLanguages();
PC.loadCountryMedicalIssues();
PC.loadProjectStartDates();