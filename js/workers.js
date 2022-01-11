function update_workers(df, selectedGroup, x) {

    var svg = d3.select("#workers svg g.main-group");


    var xAxis = d3.select("#workers svg").select('g.myXaxis');
    var yAxis = d3.select("#workers svg").select("g.myYaxis");

    // Create new data with the selection?
    var dataFilter = df.filter(function(d) { return d.name == selectedGroup })

    //var x = d3.scaleLinear()
    //    .domain(d3.extent(dataFilter, function(d) { return d.year; }))
    //    .range([0, width]);


    /*   var x = d3.scaleTime()
       .domain([new Date('2000-01-01'), new Date('2020-12-31')]) */


    var y = d3.scaleLinear()
        .domain([0, d3.max(dataFilter, function(d) { return +d.avg; })])
        .range([height, 0]);




    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(5)
    }


    svg.selectAll(".grid")
        .remove();
    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

    xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x))
        .attr("transform", "translate(0," + height + ")")

    yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y));


    var line = svg
        .select('path.line');

    /*         .data(dataFilter)
                .attr("d", d3.line()
                    .x(function(d) { return x(d.year) })
                    .y(function(d) { return y(+d.avg) })
                )
                .attr("stroke", 'red')
                .style("stroke-width", 4)
                .style("fill", "none")
 */

    // Give these new data to update line
    line
        .datum(dataFilter)
        .transition()
        .duration(1000)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year) })
            .y(function(d) { return y(+d.avg) })
        );

}