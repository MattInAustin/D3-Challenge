// Variables for Width, Height, and respective margins
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Assign Width and Height attributes to chart.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import the data
(async function(){
  var stateData = await d3.csv("data.csv").catch(function(error) {
    console.log(error);
  });


    // Parse data as numbers
    stateData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

    // Assign scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([0,25])
      .range([0,width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.poverty)])
      .range([height, 0]);

    // Make axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Add axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // CIRCLE ATTR
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".9");

    // Tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
      });

    // Call Tooltip
    chartGroup.call(toolTip);

    // Show/hide tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // ATTR for labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Poverty");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Healthcare");
})()
