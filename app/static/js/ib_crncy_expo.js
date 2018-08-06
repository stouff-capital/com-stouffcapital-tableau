(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
    var cols = [{
      id: "ticker__given",
      alias: "Ticker",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "data__datestamp",
      alias: "DATESTAMP",
      dataType: tableau.dataTypeEnum.date
    }, {
      id: "asset__NAME",
      alias: "NAME",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "asset__ID_ISIN",
      alias: "ID_ISIN",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "asset__CRNCY",
      alias: "asset.CRNCY",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "asset__GICS_SECTOR_NAME",
      alias: "GICS_SECTOR_NAME",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "asset__GICS_INDUSTRY_GROUP_NAME",
      alias: "GICS_INDUSTRY_GROUP_NAME",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "asset__GICS_INDUSTRY_NAME",
      alias: "GICS_INDUSTRY_NAME",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "asset__COUNTRY_ISO__ISOALPHA2Code",
      alias: "COUNTRY__ISOALPHA2Code",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "asset__COUNTRY_ISO__name",
      alias: "COUNTRY_NAME",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "asset__region__MatrixRegion",
      alias: "REGION",
      dataType: tableau.dataTypeEnum.string
    }, {
      id: "derived__data__capiBaseCrncy__baseValueInBln",
      alias: "capiBaseInBln",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "raw__sources__bbg__data__VOLATILITY_90D",
      alias: "VOLATILITY_90D",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "raw__sources__bbg__data__CHG_PCT_1YR",
      alias: "CHG_PCT_1YR",
      dataType: tableau.dataTypeEnum.float
    }, {
      id: "models__GROWTH__CURRENT_EPSMthChg",
      alias: "GROWTH__CURRENT_EPSMthChg",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__GROWTH__PAST_EPSStability",
      alias: "GROWTH__PAST_EPSStability",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__GROWTH__CURRENT_BEstEPS4WeekChangeNextYear",
      alias: "GROWTH__CURRENT_BEstEPS4WeekChangeNextYear",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__GROWTH__PAST_EPSGrowthYr",
      alias: "GROWTH__PAST_EPSGrowthYr",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__GROWTH__CURRENT_BEstEPS4WeekChangeCurrentYear",
      alias: "GROWTH__CURRENT_BEstEPS4WeekChangeCurrentYear",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__GROWTH__NEXT_EPSGrowth",
      alias: "GROWTH__NEXT_EPSGrowth",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__GROWTH__CURRENT_RatioEPSCurrentYearLastEPS",
      alias: "GROWTH__CURRENT_RatioEPSCurrentYearLastEPS",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__GROWTH__CURRENT_EPSSurprise",
      alias: "GROWTH__CURRENT_EPSSurprise",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__GROWTH__CURRENT_RatioEPSNextYrCurrentYr",
      alias: "GROWTH__CURRENT_RatioEPSNextYrCurrentYr",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__GROWTH__scoring__final_score",
      alias: "GROWTH",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__MF__scoring__final_score",
      alias: "MF",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__RSST__scoring__final_score",
      alias: "RSST",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__RV__scoring__final_score",
      alias: "RV",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__EQ__scoring__final_score",
      alias: "EQ",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__SALES__scoring__final_score",
      alias: "SALES",
      dataType: tableau.dataTypeEnum.int
    }, {
      id: "models__SMARTSENT__scoring__final_score",
      alias: "SMARTSENT",
      dataType: tableau.dataTypeEnum.int
    }];

    var tableSchema = {
      id: "centraleFeed",
      alias: "Centrale last run",
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
      url: '/tableau/data/ib/fx/expo',
      dataType: 'json',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', make_base_auth( tableau.username, tableau.password ));
      },
      success: function(data) {
        tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = data.length; i < len; i++) {

          var company = {
            "data__datestamp": data[i]["_index"].replace(/\./g, "-").replace('central-', '')
          };

          var companyFields = ["ticker.given", "asset.NAME", "asset.ID_ISIN", "asset.CRNCY", "asset.GICS_SECTOR_NAME", "asset.GICS_INDUSTRY_GROUP_NAME", "asset.GICS_INDUSTRY_NAME", "asset.COUNTRY_ISO.ISOALPHA2Code", "asset.COUNTRY_ISO.name", "asset.region.MatrixRegion", "derived.data.capiBaseCrncy.baseValueInBln", "raw.sources.bbg.data.VOLATILITY_90D", "raw.sources.bbg.data.CHG_PCT_1YR", "models.GROWTH.components.CURRENT_EPSMthChg.intermediary_score", "models.GROWTH.components.PAST_EPSStability.intermediary_score", "models.GROWTH.components.CURRENT_BEstEPS4WeekChangeNextYear.intermediary_score", "models.GROWTH.components.PAST_EPSGrowthYr.intermediary_score", "models.GROWTH.components.CURRENT_BEstEPS4WeekChangeCurrentYear.intermediary_score", "models.GROWTH.components.NEXT_EPSGrowth.intermediary_score", "models.GROWTH.components.CURRENT_RatioEPSCurrentYearLastEPS.intermediary_score", "models.GROWTH.components.CURRENT_EPSSurprise.intermediary_score", "models.GROWTH.components.CURRENT_RatioEPSNextYrCurrentYr.intermediary_score", "models.GROWTH.scoring.final_score", "models.MF.scoring.final_score", "models.RSST.scoring.final_score", "models.RV.scoring.final_score", "models.EQ.scoring.final_score", "models.SALES.scoring.final_score", "models.SMARTSENT.scoring.final_score"];

          for (var f=0, flen = companyFields.length; f < flen; f++ ) {
            company[ companyFields[f].replace("models.GROWTH.components.", "models.GROWTH.").replace(".intermediary_score", "").replace(/\./g, "__") ] = data [i] [ companyFields[f] ]
          }

          tableData.push(company);
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
      tableau.connectionName = "Centrale Feed"; // This will be the data source name in Tableau

      tableau.username = $("input#username").val();
      tableau.password = $("input#password").val();

      tableau.submit(); // This sends the connector object to Tableau
    });
  });
})();
