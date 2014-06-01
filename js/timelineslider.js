/**
 * Created by nmew on 6/1/14.
 */
function loadTimeline(divId, startDatesDomain) {
    var id = "#" + divId;
//    var startDates = PC.data.projectStartDates;  // year 2012 is an estimation
//    var startDatesDomain = [startDates[0], startDates[startDates.length - 1]];
    //    console.log(startDates);

    var margin = {top: 50, right: 40, bottom: 100, left: 40},
        width = 960 - margin.left - margin.right,
        height = 150 - margin.top - margin.bottom,
        tickSize = 6,
        format = d3.time.format("%Y-%m-%d %H:%M");

    var timeScale = d3.time.scale()
        .domain(startDatesDomain)
        .range([0, 500]);

    var xAxis = d3.svg.axis()
        .scale(timeScale)
        .ticks(d3.time.months)
        .tickSize(tickSize, 1);

    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", tickSize + 2)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");



    var selectedYear = startDatesDomain[0];

    var selectorHandHeight = Math.max(height - 30, 60);

    var selectorHand = svg.append("g")
        .attr("class", "selectorHand")
        .attr("transform", "translate(" + (timeScale(selectedYear)) + ",0)");

    selectorHand.append("line")
        .attr("y1", -25)
        .attr("y2", -2);



    d3.select(id + " g.axis")
        .on("click", function () {
            var c = d3.mouse(this);
            selectYearForPosition(c[0]);
        });

    function dragSelectorHand(d) {
        var c = d3.mouse(this.parentNode);   // get mouse position relative to its container
        selectYearForPosition(c[0]);
    }

    function selectYearForPosition(cx) {
        var year = Math.round(timeScale.invert(cx));
        selectYear(year, true);
        var format = d3.time.format("%Y-%m-%d");
        var displayYear = format(new Date(year));
        $("#dateDisplay").html(displayYear);
    }

    function selectYear(year, duration) {
        var r = d3.extent(timeScale.domain());
        if (year < r[0]) year = r[0];
        if (year > r[1]) year = r[1];
        selectedYear = year;

        var t = d3.select(id)
            .transition()
            .ease("linear")
            .duration(duration);

        t.select(id + " g.selectorHand")
            .attr("transform", "translate(" + (timeScale(year)) + ",0)");

    }

    var selectorHandDrag = d3.behavior.drag()
        .origin(Object)
        .on("drag", dragSelectorHand);


    d3.select(id + " .selectorHand")
        .on("mouseover", function () {
            d3.select(this).select("circle.halo")
                .transition()
                .duration(250)
                .attr("opacity", "1.0");
        })
        .on("mouseout", function () {
            d3.select(this).select("circle.halo")
                .transition()
                .duration(250)
                .attr("opacity", "0.5");
        })
        .call(selectorHandDrag);


    d3.select(id + " g.chart")
        .on("click", function () {
            var c = d3.mouse(this);
            selectYearForPosition(c[0]);
        });
    
}