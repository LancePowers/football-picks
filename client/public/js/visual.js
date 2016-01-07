// (NFC), packers, vikings, bears, lions, redskins, giants, cowboys, eagles, falcons, panthers, saints, bucs, 49ers, seahawks, rams, cardinals
// (AFC), ravens, bengals, steelers, browns, patriots, dolphins, jets, bills, texans, colts, titans, jaguars, broncos, chargers, raiders, chiefs
// 4 = 2 divisional games, 2 = 1 home game, 1 = 1 away game
//var matrix = [
//  [0, 15, 4, 4, 2, 1, 1, 2, 2, 0, 0, 0, 1, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [4, 0, 4, 4, 2, 1, 1, 2, 0, 2, 0, 0, 0, 1, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [4, 4, 0, 4, 1, 2, 2, 1, 0, 0, 2, 0, 0, 0, 1, 0, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [4, 4, 4, 0, 1, 2, 2, 1, 0, 0, 0, 2, 0, 0, 0, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 2, 2, 0, 4, 4, 4, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2], [2, 2, 1, 1, 4, 0, 4, 4, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1], [2, 2, 1, 1, 4, 4, 0, 4, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1], [1, 1, 2, 2, 4, 4, 4, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2], [1, 0, 0, 0, 2, 0, 0, 0, 0, 4, 4, 4, 1, 2, 2, 1, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 2, 0, 0, 4, 0, 4, 4, 1, 2, 2, 1, 0, 0, 0, 0, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 2, 0, 4, 4, 0, 4, 2, 1, 1, 2, 0, 0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 2, 4, 4, 4, 0, 2, 1, 1, 2, 0, 0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0], [2, 0, 0, 0, 1, 0, 0, 0, 2, 2, 1, 1, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0], [0, 2, 0, 0, 0, 1, 0, 0, 1, 1, 2, 2, 4, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0], [0, 0, 2, 0, 0, 0, 1, 0, 1, 1, 2, 2, 4, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0], [0, 0, 0, 2, 0, 0, 0, 1, 2, 2, 1, 1, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0], [2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 2, 1, 2, 1, 2, 0, 0, 0, 1, 0, 0, 0], [2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 4, 2, 1, 2, 1, 0, 2, 0, 0, 0, 1, 0, 0], [1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 4, 1, 2, 1, 2, 0, 0, 2, 0, 0, 0, 1, 0], [1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 1, 2, 1, 2, 0, 0, 0, 2, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0, 1, 1, 2, 2, 0, 4, 4, 4, 1, 0, 0, 0, 2, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 2, 2, 1, 1, 4, 0, 4, 4, 0, 1, 0, 0, 0, 2, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 0, 0, 0, 0, 1, 1, 2, 2, 4, 4, 0, 4, 0, 0, 1, 0, 0, 0, 2, 0], [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 2, 2, 1, 1, 4, 4, 4, 0, 0, 0, 0, 1, 0, 0, 0, 2], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 4, 4, 4, 2, 1, 2, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 1, 0, 0, 0, 2, 0, 0, 4, 0, 4, 4, 2, 1, 2, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 1, 0, 0, 0, 2, 0, 4, 4, 0, 4, 1, 2, 1, 2], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 1, 0, 0, 0, 2, 4, 4, 4, 0, 1, 2, 1, 2], [0, 0, 0, 0, 16, 16, 16, 16, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 16, 0, 0, 0, 16, 16, 16, 16, 0, 32, 32, 32], [0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 2, 2, 1, 1, 4, 0, 4, 4], [0, 0, 0, 0, 2, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 1, 1, 2, 2, 4, 4, 0, 4], [0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 2, 2, 1, 1, 4, 4, 4, 0]];

function visual(matrix) {
    var chord = d3.layout.chord()
        .padding(0.02)
        //.sortGroups(d3.descending)
        .matrix(matrix);

    var r1 = 960 / 2,
        r0 = r1 - 120;

    var width = 960,
        height = 720,
        innerRadius = Math.min(width, height) * .38,
        outerRadius = innerRadius * 1.08;
    //var fill = d3.scale.category20();
    var fill = d3.scale.ordinal()
        .domain(d3.range(32));

    fill.range(['#294239', '#240A67', '#00133F', '#006EA1', '#8C001A', '#003155', '#002E4D', '#002F30',
              '#000000', '#0097C6', '#C6A876', '#D6303A', '#940029', '#030F1F', '#C1A05B', '#B10339',
              '#2B025B', '#FF2700', '#FFBF00', '#4C230E', '#00295B', '#006B79', '#174032', '#00133F',
              '#00133F', '#00417E', '#0080C0', '#00839C', '#FF652B', '#0F83B8', '#B5BBBD', '#C60024']);
    var teams = ['Packers', 'Vikings', 'Bears', 'Lions', 'Redskins', 'Giants', 'Cowboys', 'Eagles', 'Falcons', 'Panthers', 'Saints', 'Bucs', '49ers', 'Seahawks', 'Rams', 'Cardinals', 'Ravens', 'Bengals', 'Steelers', 'Browns', 'Patriots', 'Dolphins', 'Jets', 'Bills', 'Texans', 'Colts', 'Titans', 'Jaguars', 'Broncos', 'Chargers', 'Raiders', 'Chiefs'];

    var images = [];

    var svg = d3.select("#season-chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("circle")
        .attr("r", 348);

    svg.append("g").selectAll("path")
        .data(chord.groups)
        .enter().append("path")
        .style("fill", function (d) {
            return fill(d.index);
        })
        .style("stroke", function (d) {
            return fill(d.index);
        })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .on("mouseover", fade(0))
        .on("mouseout", fade(1))
        .on("click", click)


    // Add groups.
    g = svg.append("g").selectAll("g")
        .data(chord.groups)
        .enter().append("g")
        .attr("class", "group");

    svg.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter().append("path")
        .attr("d", d3.svg.chord().radius(innerRadius))
        .style("fill", function (d, i) {
            return fill(d.source.index);
        })
        .on("click", click);


    images = g.append("image");

    images.each(function (d) {
            d.angle = (d.startAngle + d.endAngle) / 2;
        })
        .attr("xlink:href", function (d, i) {
            return "//81d98e225a16b7db5c24a7f539f82027e76e3e30.googledrive.com/host/0BwdcZmhBfglmaDBXVEdPZUZXZGM/logos/" + teams[i] + ".gif";
        })
        .attr("transform", function (d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + (r0 - 60) + "," + "-20)" + "rotate(90)" + "translate(0, -40)";
            //+ "rotate(" + (180 - d.startAngle * 180) + ")";
        })
        .attr("width", 40)
        .attr("height", 40)
        .on("mouseover", fade(0))
        .on("mouseout", fade(1));

    svg.append("image")
        .attr("xlink:href", "//81d98e225a16b7db5c24a7f539f82027e76e3e30.googledrive.com/host/0BwdcZmhBfglmaDBXVEdPZUZXZGM/logos/nfc.gif")
        .attr("width", 50)
        .attr("height", 50)
        .attr("transform", "translate(360, 0)");

    svg.append("image")
        .attr("xlink:href", "//81d98e225a16b7db5c24a7f539f82027e76e3e30.googledrive.com/host/0BwdcZmhBfglmaDBXVEdPZUZXZGM/logos/afc.gif")
        .attr("width", 50)
        .attr("height", 50)
        .attr("transform", "translate(-410, 0)");




    // Click handler for group(team)
    function click(e) {
        svg.selectAll(".group").each(function (d, i) {

        });
    }

    function display() {
        return function (g, i) {

            svg.selectAll(".chord path")
                .filter(function (d) {
                    return d.source.index != i && d.target.index != i;
                })
                .transition()
                .style("opacity", opacity);
        };
    }


    function fade(opacity) {
        return function (g, i) {
            console.log(g.source, g.target, i);
            svg.selectAll(".chord path")
                .filter(function (d) {
                    return d.source.index != i && d.target.index != i;
                })
                .transition()
                .style("opacity", opacity);
        };
    }
}