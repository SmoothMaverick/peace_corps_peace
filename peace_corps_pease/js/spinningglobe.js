/**
 * Created by nmew on 6/1/14.
 */
    var containerId = "spinningGlobe";
    var width = 760,
        height = 500;

    var projection = d3.geo.orthographic()
        .scale(248)
        .clipAngle(90);

    var canvas = d3.select("#" + containerId).append("canvas")
        .attr("width", width)
        .attr("height", height);

    var c = canvas.node().getContext("2d");

    var path = d3.geo.path()
        .projection(projection)
        .context(c);

    var title = d3.select("#infoBox .countryName");
    var medicalIssues = d3.select("#infoBox .medicalIssues");

    PC.showCountryData = function(countryName) {
        title.text(countryName);
        var medIssues  = PC.data.getCountryMedicalIssues(countryName);
        if(medIssues) {
            medIssues = "<h3><small>" + medIssues.replace(/^.*:/, "Medical Restrictions:</small></h3><ul><li><span>").replace(/;/g,"</span></li><li><span>") + "</span></li></ul>";
        }
        medicalIssues.html(medIssues);
        PC.data.getFilteredPosts([countryName]).done(function(posts){
            var departureDates = [];
            for(var i=0; i<posts.length; i++) {
                console.log(posts[i]);
                var format = d3.time.format("%Y-%mmm-%d");
//                var displayYear = format(new Date(posts.staging_start_date_staging_start_date));
//                $("#dateDisplay").html(displayYear);
                departureDates.push(format(new Date(posts.staging_start_date_staging_start_date)));
            }
            $("#infoBox .postCount").html(posts.length + " posts coming up");
//            $("#infoBox .departureDates").html(departureDates.join(" "));
        });

    };

    queue()
        .defer(d3.json, "data/world-110m.json")
        .defer(d3.tsv, "data/world-country-names.tsv")
        .await(ready);

    function ready(error, world, names) {
        var globe = {type: "Sphere"},
            land = topojson.feature(world, world.objects.land),
            countries = topojson.feature(world, world.objects.countries).features,
            borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
            i = -1,
            n = countries.length;

        countries = countries.filter(function(d) {
            return names.some(function(n) {
                if (d.id == n.id) return d.name = n.name;
            });
        }).sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
        n = countries.length;

        (function transition() {
            d3.transition()
                .duration(1250)
                .each("start", function() {
                    var countryName = countries[i = (i + 1) % n].name;
                    PC.showCountryData(countryName);
                })
                .tween("rotate", function() {
                    var p = d3.geo.centroid(countries[i]),
                        r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                    return function(t) {
                        projection.rotate(r(t));
                        c.clearRect(0, 0, width, height);
                        c.fillStyle = "#bbb", c.beginPath(), path(land), c.fill();
                        c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();
                        c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
                        c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
                    };
                })
                .transition()
                .each("end", transition);
        })();


        PC.spinToCountry = function(countryName) {
            for(var i = 0; i<countries.length; i++) {
                if (countries[i].name == countryName) {
//                    console.log("found ", countryName, "at index ", i);
                    break;
                }
            }
//            var i = names.indexOf(countryName);
            console.log(countryName, i);
//            console.log(names);
            d3.transition()
                .duration(1250)
                .each("start", function() {
                    var countryName = countries[i].name;
                    PC.showCountryData(countryName);
                })
                .tween("rotate", function() {
                    var p = d3.geo.centroid(countries[i]),
                        r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                    return function(t) {
                        projection.rotate(r(t));
                        c.clearRect(0, 0, width, height);
                        c.fillStyle = "#bbb", c.beginPath(), path(land), c.fill();
                        c.fillStyle = "#f00", c.beginPath(), path(countries[i]), c.fill();
                        c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
                        c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
                    };
                });
        };

    }



