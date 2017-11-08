// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  // Append a group area, then set its margins
var chart = svg.append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load demo and risk data from data.csv
d3.csv("data.csv", function(error, healthData) {

  // Throw an error if one occurs
  if (error) throw error;

  // Print the healthData
  console.log(healthData);

  // Cast the % values to a number
  healthData.forEach(function(data) {
    data.bachelors = +data.bachelors;
    data.lackHealthcare = +data.lackHealthcare;
  });

  // Configure a linear scale with a range between 0 and the chartWidth
  //   x-axis will contain demographic census data
  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Configure a linear scale with a range between the chartHeight and 0
  //   y-axis will contain risk data
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  // Set the domain for the xLinearScale function
  // d3.extent returns the an array containing the min and max values for the property specified
  xLinearScale.domain(d3.extent(healthData, function(data) {
    return data.bachelors;
  }));

  // Set the domain for the yLinearScale function
  yLinearScale.domain([0, d3.max(healthData, function(data) {
    return data.lackHealthcare;
  })]);

  // Create two new functions passing the scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
    var stateName = data.state;
    var bachDegree = data.bachelors;
    var noHealth = data.lackHealthcare;
    return (stateName + "<br> Bachelor Degree or Higher: " + bachDegree + "<br> Lack Healthcare: " + noHealth);
    });

  chart.call(toolTip);

  
  chart.selectAll("circle")
    .data(healthData)
    .enter().append("circle")
    .attr("cx", function(data, index) {
        return xLinearScale(data.bachelors);
    })
    .attr("cy", function(data, index) {
        return yLinearScale(data.lackHealthcare);
    })
    .attr("r", "10")
    // .attr("r", function(data, index){
    //   return data.num_hits;
    // })
    .attr("fill", "blue")
    .on("click", function(data) {
        toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lack Healthcare (%)");

// Append x-axis labels
  chart.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
    .attr("class", "axisText")
    .text("Bachelor's Degree or higher");
});

//   // Configure a drawLine function which will use our scales to plot the line's points
//   var drawLine = d3
//     .line()
//     .x(function(data) {
//       return xLinearScale(data.bachelors);
//     })
//     .y(function(data) {
//       return yLinearScale(data.lackHealthcare);
//     });

//   // Append an SVG path and plot its points using the line function
//   svg
//     .append("path")
//       // The drawLine function returns the instructions for creating the line for milesData
//       .attr("d", drawLine(healthData))
//       .attr("class", "line");

//   // Append an SVG group element to the SVG area, create the left axis inside of it
//   svg.append("g")
//     .attr("class", "axis")
//     .call(leftAxis);

//   // Append an SVG group element to the SVG area, create the bottom axis inside of it
//   // Translate the bottom axis to the bottom of the page
//   svg.append("g")
//     .attr("class", "axis")
//     .attr("transform", "translate(0, " + chartHeight + ")")
//     .call(bottomAxis);
// });
