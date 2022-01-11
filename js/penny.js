function update_penny(df, selectedGroup, x) {



    var svg = d3.select("#penny svg g.main-group");


    var xAxis = d3.select("#penny svg").select('g.myXaxis');
    var yAxis = d3.select("#penny svg").select("g.myYaxis");


    var dataFilter = df.filter(function(d) {

        return d.name == selectedGroup
    });

    dataFilter.forEach(function(d) {
        d.arrears = +d.arrears
        d.salary = +d.salary
        d.total = +d.total
    });

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = ["salary", "arrears"]

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(dataFilter, function(d) { return (d.year) }).keys()

    //var x = d3.scaleBand()
    //    .domain([2000, 2020])
    //    .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);


    // Update the X axis
    x.domain(groups)
        .range([0, width])
        .padding([0.2])



    //xAxis.call(d3.axisTop(x)).attr("transform", "translate(0," + height + ")")

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

    var group = svg.selectAll("g.layer")
        .data(stackedData);

    group.exit().remove();

    group.enter()
        .append("g")
        .classed("layer", true)
        .attr("fill", function(d) { return color(d.key); });

    var bars = svg.selectAll("g.layer")
        .selectAll("rect")
        .data(function(d) { return d; });

    bars.enter()
        .append("rect")
        .attr("x", function(d) { return x(d.data.year); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth())
        .merge(bars)
        .transition().duration(500)
        .attr("x", function(d) { return x(d.data.year); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    bars.exit().remove();

    svg.selectAll(".grid")
        .remove();

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(5)
    }

    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

}