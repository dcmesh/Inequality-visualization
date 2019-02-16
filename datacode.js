/* Good stuff will go here */

document.addEventListener("DOMContentLoaded", function init() {
  var config = {
    table: "contributions_donotmodify",
    valueColumn: "amount",
    joinColumn: "contributor_zipcode",
    polyTable: "full_data",
    polyJoinColumn: "ZCTA5CE10",
    timeColumn: "contrib_date",
    timeLabel: "Number of Contributions",
    domainBoundMin: 1,
    domainBoundMax: 2600, //00000,
    numTimeBins: 423
  }


new MapdCon()
   .protocol("https")
   .host("use2-api.omnisci.cloud")
   .port("443")
   .dbName("full_data")
   .user("G76D714C9A79245CB83B")
   .password("qYvEOtNe4ddty0zbVgCgveuVGQQCow587T05nGMv")
   .connect(function(error, con) {
     crossfilter
       .crossfilter(con, "contributions_donotmodify")
       .then(function(cf) {
         crossfilter
           .crossfilter(con, "contributions_donotmodify")
           .then(cf2 => {
             createPolyMap(cf, con, dc, config, cf2)
             createTimeChart(cf, dc, config, cf2)
           })
       })
   })
