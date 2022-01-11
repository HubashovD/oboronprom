(function() {

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 0, bottom: 70, left: 100 },
        width = d3.select("#wear_tear").node().getBoundingClientRect().width - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#wear_tear")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Parse the Data
    d3.csv("/data/wear_tear.csv").then(function(data) {

        var allGroup = d3.map(data, function(d) { return (d.name) }).keys()

        // add the options to the button
        d3.select("#wear_tear_button")
            .selectAll('myOptions')
            .data(allGroup)
            .enter()
            .append('option')
            .text(function(d) { return d; }) // text showed in the menu
            .attr("value", function(d) { return d; }) // corresponding value returned


        // Initialize the X axis
        var x = d3.scaleBand()
            .range([0, width]);


        var xAxis = svg.append("g")


        // Initialize the Y axis
        var y = d3.scaleLinear()
            .range([height, 0])
            //.padding(0.2);

        var yAxis = svg.append("g")
            .attr("class", "myYaxis")


        update('"Львівський державний завод "ЛОРТА"')

        function update(selectedGroup) {

            var dataFilter = data.filter(function(d) { return d.name == selectedGroup });

            dataFilter.forEach(function(d) {
                d.tear = +d.tear
                d.wear = +d.wear
                d.total = +d.total
            });

            // List of subgroups = header of the csv files = soil condition here
            var subgroups = ["wear", "tear"]

            // List of groups = species here = value of the first column called group -> I show them on the X axis
            var groups = d3.map(dataFilter, function(d) { return (d.year) }).keys()

            // Add X axis
            /*var x = d3.scaleBand()
                .domain(groups)
                .range([0, width])
                .padding([0.2])
                
                            var xAxis = svg.append("g")
                                .attr("transform", "translate(0," + height + ")")
                                .call(d3.axisBottom(x).tickSizeOuter(0))
                                .style("disp
                                lay", "none");
                */

            // Update the X axis
            x.domain(groups)
                //.range([0, 20 * dataFilter.length])
                .range([0, width])
                .padding([0.2])


            //d3.select("#wear_tear").select("svg")
            //    .attr("width", 20 * dataFilter.length + 50)

            xAxis.call(d3.axisBottom(x)).attr("transform", "translate(0," + height + ")")

            // Update the Y axis
            y.domain([0, d3.max(dataFilter, function(d) { return d.total })]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));


            // color palette = one color per subgroup


            var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#e41a1c', '#377eb8'])

            //stack the data? --> stack per subgroup
            var stackedData = d3.stack()
                .keys(subgroups)
                (dataFilter)


            var tooltip = d3.select("#wear_tear")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")


            // Three function that change the tooltip when user hover / move / leave a cell
            var showTooltip = function(d) {
                tooltip
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
                tooltip
                    .html(d.wear + ": " + d.tear)
                    .style("left", (d3.mouse(this)[0] + 50) + "px")
                    .style("top", (d3.mouse(this)[1] - 20) + "px")
                console.log(this)
            }
            var moveTooltip = function(d) {
                    tooltip
                        .style("left", (d3.mouse(this)[0] + 50) + "px")
                        .style("top", (d3.mouse(this)[1] - 20) + "px")
                }
                // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
            var hideTooltip = function(d) {
                tooltip
                    .transition()
                    .duration(100)
                    .style("opacity", 1)
            }


            // Create the u variable
            var u = svg.selectAll("rect")
                .data(stackedData)

            u
                .enter()
                .append("rect") // Add a new rect for each new elements
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip)
                // Enter in the stack data = loop key per key = group per group
                .data(stackedData)
                .enter().append("g")
                .attr("fill", function(d) { return color(d.key); })
                .selectAll("rect")
                // enter a second time = loop subgroup per subgroup to add all rectangles
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("x", function(d) { return x(d.data.year); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth())

            u
                .exit()
                .remove()
        }
        // When the button is changed, run the updateChart function
        d3.select("#wear_tear_button").on("change", function(d) {
            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
            update(selectedOption)
        })
    })

})();