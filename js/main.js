var margin = { top: 0, right: 0, bottom: 30, left: 100 },
    width = d3.select("#penny").node().getBoundingClientRect().width - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var margin_penny = { top: 30, right: 0, bottom: 5, left: 100 },
    width_penny = d3.select("#penny").node().getBoundingClientRect().width - margin_penny.left - margin_penny.right,
    height_penny = 300 - margin.top - margin.bottom;


Promise.all([
    d3.csv("data/penny.csv"),
    d3.csv("data/workers.csv")
]).then(function(data) {

    /* select input */

    var allGroup = d3.map(data[0], function(d) { return (d.name) }).keys();

    d3.select("#penny_workers_button")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function(d) { return d; }) // text showed in the menu
        .attr("value", function(d) { return d; }) // corresponding value returned by the button 



    /* penny chart */
    var svg_penny = d3.select("#penny")
        .append("svg")
        .attr("width", width + margin_penny.left + margin_penny.right)
        .attr("height", height + margin_penny.top + margin_penny.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin_penny.left + "," + margin_penny.top + ")")
        .attr("class", "main-group");


    svg_penny.append("g")
        .attr("class", "myXaxis");

    svg_penny.append("g")
        .attr("class", "myYaxis")

    var x = d3.scaleBand()
        .domain([2000, 2020])
        .range([0, width]);


    var selectedOption = d3.select(this).property("value");
    update_penny(data[0], 'Ізюмський казенний приладобудівний завод', x)



    /* workers chart */
    var svg_workers = d3.select("#workers")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "main-group");


    // Add X axis --> it is a date format




    svg_workers.append("g")
        .attr("class", "myXaxis")
        .attr("transform", "translate(0," + height + ")");

    svg_workers.append("g")
        .attr("class", "myYaxis")

    var line = svg_workers
        .append('g')
        .append("path")
        .attr("class", "line")
        .attr("stroke", 'red')
        .style("stroke-width", 4)
        .style("fill", "none");



    update_workers(data[1], 'Державне Південне виробничо-технічне підприємство', x)



    d3.select("#penny_workers_button").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value");

        console.log(selectedOption);
        // run the updateChart function with this selected option
        update_penny(data[0], selectedOption, x);
        update_workers(data[1], selectedOption, x)

    })

})