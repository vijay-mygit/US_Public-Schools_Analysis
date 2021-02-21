
// Return an Array of school type
function getSectors(country, data) {

    return country == '' ? data.map(item => item.TYPE) :
        data.filter(item => item.STATE == country).map(item => item.TYPE);
};

function getCountryData(state, data) {
    return state == '' ? data.map(item => item) :
        data.filter(item => item.STATE == state).map(item => item);
};



// Function for Histogram
function plotHist(country, data) {
    var sectors = getSectors(country, data);

    var trace1 = {
        histfunc: "count",
        x: sectors,
        type: 'histogram',
        marker: {
            color: "Blue",
            opacity: 0.8
        }
    };

    var data = [trace1];

    var layout = {
        title: 'Number of schools in each Type',
        xaxis: {
            title: 'Type of Public School',
            automargin: true
        },
        yaxis: {
            title: 'Count'
        }
    };

    Plotly.newPlot('histogram', data, layout);
};


function plotTopCompanies(state, data) {
    
    var json = getCountryData(state, data);

    json.forEach(function (row) {
        row["Avg AGI"] = +row["Avg AGI"];
        row['Avg total income'] = +row['Avg total income'];
        row.POPULATION = +row.POPULATION;
        row["Taxable income amount"] = +row["Taxable income amount"] ;
        row.ENROLLMENT = +row.ENROLLMENT;
        
    });
    json_1 = json.sort(function(a, b){return parseFloat(b.ENROLLMENT)-parseFloat(a.ENROLLMENT)})
    var top10 = json_1.slice(0, 10)

    pyvalues = top10.map(d => d["Avg AGI"])
    myvalues = top10.map(d => d['Avg total income'])
    ayvalues = top10.map(d => d.POPULATION)
    ryvalues = top10.map(d => d.ZIP)
    zyvalues = top10.map(d => d.ENROLLMENT)
    xvalues = top10.map(d => d.CITY)

    //Bar Plot
    var trace = {
        
        x: xvalues,
        y: zyvalues,
        name: "Enrollment",
        type: "bar",
        marker: {
            color: "Blue",
            opacity: 0.8
        }
    }
    
    var trace2 = {
        x: xvalues,
        y: ayvalues,
        name: "Population",
        type: "bar",
        marker: {
            color: "Black",
            opacity: 0.6
        }
    }      

    var layout = {
        title: "Top 10 Cities with Public Schools",
        automargin: true,
        barmode: "group",
        xaxis: {
            autotick: true,
            ticks: 'outside',
            tick0: 0,
            tickangle: -45,
            tickfont: {
                family: 'Berlin Sans FB',
                size: 14
            },
            automargin: true
        },
        yaxis: {
            ticks: 'outside',
            tick0: 0,
            automargin: true
        }
    };

    var data = [trace,trace2]
    Plotly.newPlot("bar", data, layout);
    

    var trace1 = {
        x: xvalues,
        y: pyvalues,
        name: "Average AGI",
        type: "bar",
        marker: {
            color: "Blue",
            opacity: 0.8
        }
    }

    var trace3 = {
        x: xvalues,
        y: myvalues,
        name: "Average Total Income",
        type: "bar",
        marker: {
            color: "Black",
            opacity: 0.6
        }
    }

    var layout = {
        title: "Avg Income and AGI for top cities",
        automargin: true,
        barmode: "group",
        xaxis: {
            autotick: true,
            ticks: 'outside',
            tick0: 0,
            tickangle: -45,
            tickfont: {
                family: 'Berlin Sans FB',
                size: 14
            },
            automargin: true
        },
        yaxis: {
            ticks: 'outside',
            tick0: 0,
            automargin: true
        }
    };

    var data1 = [trace1,trace3]
    Plotly.newPlot("bar_1", data1, layout);    

    metaData = json[0]

    var meta_info = d3.select("#sample-metadata")
    meta_info.html("<h5><strong> School Name : </strong>" + json[0].NAME + "<br>" +
        "<strong> Address : </strong>" + json[0].ADDRESS + "<br>" +
        "<strong> City : </strong>" + json[0].CITY + "<br>" +
        "<strong> State : </strong>" + json[0].STATE + "<br>" +
        "<strong> Type : </strong>" + json[0].TYPE + "<br>" +
        "<strong> Population : </strong>" + json[0].POPULATION + "<br>" +
        "<strong> Starting Grade : </strong>" + json[0].ST_GRADE + "<br>" +
        "<strong> Ending Grade : </strong>" + json[0].END_GRADE + "<br>" +
        "<strong> Enrollment : </strong>" + json[0].ENROLLMENT + "<br>" +
        "<strong> Average AGI : </strong>" + json[0]['Avg AGI'])
};

// Function ot handle the change in drop down selection
function optionChanged(val) {
    fetch(url)
        .then(response => response.json())
        .then(json => {            
            if (val == 'All States') {
                val = ''
            };
            
            plotHist(val, json);
            plotTopCompanies(val, json);
            
        });
};

function init() {

    // Call the flask API to retrieve the JSON data
    fetch(url)
        .then(response => response.json())
        .then(json => {

            
            var arrCountries = json.map(item => item.STATE);

            var arrUniqueCountries = arrCountries.filter(function (item, pos) {
                return arrCountries.indexOf(item) == pos;
            }).sort();

            // Add World to Unique countries list
            arrUniqueCountries.splice(0, 0, 'All States');

            

            var options = selObj.selectAll("option")
                .data(arrUniqueCountries) // Array of individual IDs
                .enter() // Used when the joined array is longer than the selection
                .append("option")
                .attr('value', (v => v))
                .text((t => t));
            
            var state = '';

            // Call function to build plots
            
            plotHist(state, json);
            plotTopCompanies(state, json);
            
        });

};

const url = 'http://127.0.0.1:5000/schools';

// Select the dropdown object
var selObj = d3.select('#selDataset');

init();