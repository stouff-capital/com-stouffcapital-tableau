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
      id: "ib_assetMultiplier",
      alias: "IB Asset Multiplier",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_transaction_datetime",
      alias: "IB Transaction Datetime",
      dataType: tableau.dataTypeEnum.datetime
    }, {
      id: "ib_transaction_execQuantity",
      alias: "IB Transaction Execution Quantity",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_transaction_execPrice",
      alias: "IB Transaction Execution Price",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_transaction_valeurLocal",
      alias: "IB Transaction Exec Value local currency",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_transaction_fxRate",
      alias: "IB FX rate eod of day",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_transaction_valeurGrossBase",
      alias: "IB Transaction Exec Value base currency",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_transaction_commissionsLocal",
      alias: "IB Transaction Commission local currency",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_transaction_commissionsBase",
      alias: "IB Transaction Commission base currency",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "ib_transaction_commissionsBps",
      alias: "IB Transaction Commission bps",
      dataType: tableau.dataTypeEnum.float
    }];

    var tableSchema = {
      id: "ibFeedTransactions",
      alias: "IB Transactions",
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
      url: '/tableau/data/ib/eod/transactions',
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', make_base_auth( tableau.username, tableau.password ));
      },
      success: function(data) {
        tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = data.length; i < len; i++) {

          var transaction = {

          };

          var transactionMapping = [["Catégorie d'actifs", "ib_assetType"], ["Symbole", "ib_assetSymbole"], ["Description", "ib_assetDescription"], ["Devise", "ib_assetCurrency"], ["Multiplicateur", "ib_assetMultiplier"], ["Date/Heure", "ib_transaction_datetime"], ["Quantité", "ib_transaction_execQuantity"], ["Prix Trans.", "ib_transaction_execPrice"], ["Produits", "ib_transaction_valeurLocal"], ["fxRate", "ib_transaction_fxRate"], ["valeurGrossBase", "ib_transaction_valeurGrossBase"], ["Comm/Tarif", "ib_transaction_commissionsLocal"], ["Comm/TarifBase", "ib_transaction_commissionsBase"], ["TarifBps", "ib_transaction_commissionsBps"] ];

          for (var f=0, flen = transactionMapping.length; f < flen; f++ ) {
            transaction[transactionMapping[f][1]] = data [i] [ transactionMapping[f][0] ]
          }

          tableData.push(transaction);
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
