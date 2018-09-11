(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  var cols = [{
    id: 'data_timestamp',
    alias: 'XLS Data Timestamp',
    dataType: tableau.dataTypeEnum.datetime
  }, {
    id: 'asset_bbgId',
    alias: 'XLS Asset Bbg Id',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset_type',
    alias: 'XLS Asset Type',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset_bbgTicker',
    alias: 'XLS Asset Bbg ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_bbgId',
    alias: 'XLS Underlying Bbg Id',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_internalId',
    alias: 'XLS Underlying Internal Id',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_type',
    alias: 'XLS Underlying type',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_bbgTicker',
    alias: 'XLS Underlying Bbg Ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_name',
    alias: 'XLS Underlying Name',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset_multiplier',
    alias: 'XLS Asset Multiplier',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_name',
    alias: 'XLS Underlying Name',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset_priceLast',
    alias: 'XLS Asset Price Last',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'underlying_country',
    alias: 'XLS Underlying ISO Country',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_region',
    alias: 'XLS Underlying Region',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_currency',
    alias: 'XLS Underlying Currency',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_sector',
    alias: 'XLS Underlying Bbg Sector',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_industry',
    alias: 'XLS Underlying Bbg Industry',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_gicsSector',
    alias: 'XLS Underlying GICS Sector',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_gicsIndustry',
    alias: 'XLS Underlying GICS Industry',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_currencyOverride',
    alias: 'XLS Underlying Curency Override',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlying_beta',
    alias: 'XLS Underlying Beta',
    dataType: tableau.dataTypeEnum.float
  }, /*{
    id: 'underlying_rel1d',
    alias: 'XLS Relative Return 1d',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'underlying_rel1w',
    alias: 'XLS Relative Return 1w',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'underlying_rel1m',
    alias: 'XLS Relative Return 1m',
    dataType: tableau.dataTypeEnum.float
  },*/ {
    id: 'position_id',
    alias: 'XLS Position Id',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset_priceClose',
    alias: 'XLS Asset Price Close',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_current',
    alias: 'XLS Position Current',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'position_side',
    alias: 'XLS Position Side',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'position_close',
    alias: 'XLS Position Close',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'position_custodyProvider',
    alias: 'XLS Position Custody Provider',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'position_custodyAccount',
    alias: 'XLS Position Custody Account',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'position_ntcfIntraday',
    alias: 'XLS Position Net Trading Cash Flow Intraday',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_pnlDailyLocal',
    alias: 'XLS Position PnL Daily Local',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_pnlFxRate',
    alias: 'XLS Position FX Rate',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_pnlDailyBase',
    alias: 'XLS Position PnL Daily Base',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'derivative_optionCallPut',
    alias: 'XLS Derivative Option CallPut',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'derivative_optionStrike',
    alias: 'XLS Derivative Option Strike',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'derivative_Maturity',
    alias: 'XLS Derivative Option Maturity',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'derivative_premiumLastBase',
    alias: 'XLS Derivative Premium Last Base',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'derivative_deltaUnderlying',
    alias: 'XLS Derivative Delta Underlying',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_deltaSide',
    alias: 'XLS Position Delta Side',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'position_exposureLongBase',
    alias: 'XLS Position Exposure Long Base',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_exposureShortBase',
    alias: 'XLS Position Exposure Short Base',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'derivative_vega',
    alias: 'XLS Derivative Vega',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'derivative_theta',
    alias: 'XLS Derivative Theta',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'underlying_priceLast',
    alias: 'XLS Underlying Price Last',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'derivative_volatiltyImplied',
    alias: 'XLS Derivative Volatlity Implied',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_pnlInpactVolatilityBase',
    alias: 'XLS Position Derivative Volatlity Impact PnL Base',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'derivative_deltaPct',
    alias: 'XLS Derivative Delta Pct',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_exposureNetBase',
    alias: 'XLS Position Exposure Net Base',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_exposureGrossBase',
    alias: 'XLS Position Exposure Gross Base',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'tag',
    alias: 'XLS Strategy Tag',
    dataType: tableau.dataTypeEnum.string
  }];


  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
    var tableSchema = {
      id: 'xlsFeedPositions',
      alias: 'XLS Positions',
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  // Download the data
  function make_basic_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return 'Basic ' + hash;
  }
  myConnector.getData = function(table, doneCallback) {
    $.ajax({
      type: 'GET',
      url: '/tableau/data/xls/positions',
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', make_basic_auth( tableau.username, tableau.password ));
      },
      success: function(data) {
        tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = data.length; i < len; i++) {

          var position = {

          };

          var positionMapping = cols.map( function(field) {return field['id']} );
          for (var f=0, flen = positionMapping.length; f < flen; f++ ) {
            position[ positionMapping[f] ] = data [i] [ positionMapping[f] ]
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
    $('#submitButton').click(function() {
      tableau.connectionName = 'XLS Feed'; // This will be the data source name in Tableau

      tableau.username = $('input#username').val();
      tableau.password = $('input#password').val();

      tableau.submit(); // This sends the connector object to Tableau
    });
  });
})();
