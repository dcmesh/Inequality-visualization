/* eslint-disable */

// The total number of tweets from Columbia
const query = "select year_ from full_data where year_ > '1960';"
// try changing airtime to arrdelay in the query
const query2 =
  "select country_code_2 from full_data where country_code_2 = 'AD';"
const defaultQueryOptions = {}
const connector = new window.MapdCon()

connector
  .protocol("https")
  .host("use2-api.omnisci.cloud")
  .port("443")
  .dbName("mapd")
  .user("G76D714C9A79245CB83B")
  .password("qYvEOtNe4ddty0zbVgCgveuVGQQCow587T05nGMv")
  .connectAsync()
  .then(session =>
    // now that we have a session open we can make some db calls:
    Promise.all([
      session.getTablesAsync(),
      session.getFieldsAsync("full_data"),
      session.queryAsync(query, defaultQueryOptions),
      session.queryAsync(query2, defaultQueryOptions)
    ])
  )
  // values is an array of results from all the promises above
  .then(values => {
    // handle result of getTablesAsync
    console.log(
      "All tables available at metis.mapd.com:",
      values[0].map(x => x.name)
    )

    // handle result of getFieldsAsync
    console.log(
      "All fields for 'flights_donotmodify':",
      values[1].reduce((o, x) => Object.assign(o, { [x.name]: x }), {})
    )

    // handle result of first query
    document.getElementById("result-async").innerHTML =
      "There are " + values[2][0].n
    console.log("Query 1 results:", values[2])

    // handle result of 2nd query
    createRowChart(values[3])
    console.log(
      "Query 2 results:",
      values[3].reduce((o, x) => Object.assign(o, { [x.key0]: x.val }), {})
    )
  })
  .catch(error => {
    console.error("Something bad happened: ", error)
  })

// http://bl.ocks.org/d3noob/8952219
function createRowChart(data) {
  var margin = { top: 20, right: 20, bottom: 150, left: 40 },
    width = 600
  height = 300

  var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05)

  var y = d3.scale.linear().range([height, 0])

  var xAxis = d3.svg
    .axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d, i) {
      return d
    })

  var yAxis = d3.svg
    .axis()
    .scale(y)
    .orient("left")
    .ticks(10)

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  x.domain(
    data.map(function(d) {
      return d.key0
    })
  )
  y.domain([
    0,
    d3.max(data, function(d) {
      return d.val
    })
  ])

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)")

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")

  svg
    .selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) {
      return x(d.key0)
    })
    .attr("width", x.rangeBand())
    .attr("y", function(d) {
      return y(d.val)
    })
    .attr("height", function(d) {
      return height - y(d.val)
    })
}
