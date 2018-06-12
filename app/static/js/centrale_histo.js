(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
    var cols = [{
      id: "ticker",
      alias: "ticker",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "dateeval",
      alias: "dateeval",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "grade",
      alias: "grade",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "rank",
      alias: "rank",
      dataType: tableau.dataTypeEnum.int
    }];

    var tableSchema = {
      id: "centraleHistoFeed",
      alias: "Centrale historical data",
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  // Download the data
  myConnector.getData = function(table, doneCallback) {
    $.getJSON("tableau/data/centrale/histo", function(data) {

      tableData = [];

      // Iterate over the JSON object
      for (var i = 0, len = data.length; i < len; i++) {

        tableData.push({
          "ticker": data[i]["ticker"],
          "dateeval": data[i]["dateeval"],
          "grade": data[i]["grade"],
          "rank": data[i]["rank"],
        });
      }

      table.appendRows(tableData);
      doneCallback();
    });
  };

  tableau.registerConnector(myConnector);

  // Create event listeners for when the user submits the form
  $(document).ready(function() {
    $("#submitButton").click(function() {
      tableau.connectionName = "Centrale Histo Feed"; // This will be the data source name in Tableau
      tableau.submit(); // This sends the connector object to Tableau
    });
  });
})();
