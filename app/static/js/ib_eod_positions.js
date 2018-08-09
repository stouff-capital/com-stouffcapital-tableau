(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
    var cols = [{
      id: "ib_assetType",
      alias: "IB Asset Type",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "ib_assetSymbole",
      alias: "IB Symbole",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "ib_assetDescription",
      alias: "IB Asset Name",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "ib_assetCurrency",
      alias: "IB Asset Currency",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "ib_assetExpiry",
      alias: "IB Asset Expiry Date",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "ib_assetMultiplier",
      alias: "IB Asset Multiplier",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_positionQuantity",
      alias: "IB position EOD",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_positionPrice",
      alias: "IB price EOD",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_positionValueLocal",
      alias: "IB postion value local currency",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_positionValueBase",
      alias: "IB postion value base currency",
      dataType: tableau.dataTypeEnum.float
    }];

    var tableSchema = {
      id: "ibFeedPositions",
      alias: "IB Positions",
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  // Download the data
  function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
  }
  myConnector.getData = function(table, doneCallback) {
    $.ajax({
      type: 'GET',
      url: '/tableau/data/ib/eod/positions',
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', make_base_auth( tableau.username, tableau.password ));
      },
      success: function(data) {
        tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = data.length; i < len; i++) {

          var position = {

          };

          var positionMapping = [ ["Catégorie d'actifs", "ib_assetType"], ["Symbole", "ib_assetSymbole"], ["Description", "ib_assetDescription"], ["Devise", "ib_assetCurrency"], ["Expiration", "ib_assetExpiry"], ["Multiplicateur", "ib_assetMultiplier"], ["Quantité", "ib_positionQuantity"], ["Prix de Fermeture", "ib_positionPrice"], ["Valeur", "ib_positionValueLocal"], ["valeurBase", "ib_positionValueBase"] ];

          for (var f=0, flen = positionMapping.length; f < flen; f++ ) {
            position[positionMapping[f][1]] = data [i] [ positionMapping[f][0] ]
          }

          tableData.push(position);
        }

        table.appendRows(tableData);
        doneCallback();
      }
    });
  };

  tableau.registerConnector(myConnector);

  // Create event listeners for when the user submits the form
  $(document).ready(function() {
    $("#submitButton").click(function() {
      tableau.connectionName = "IB Feed"; // This will be the data source name in Tableau

      tableau.username = $("input#username").val();
      tableau.password = $("input#password").val();

      tableau.submit(); // This sends the connector object to Tableau
    });
  });
})();
