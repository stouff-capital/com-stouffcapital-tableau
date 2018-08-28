(function() {

  $(document).ready(function() {
    var accessToken = Cookies.get("accessToken");
    console.log("github access_token retrieves from cookie: " + accessToken);
  });


  var myConnector = tableau.makeConnector();

  myConnector.init = function(initCallback) {

      tableau.authType = tableau.authTypeEnum.custom;

      var accessToken = Cookies.get("accessToken");
      tableau.password = accessToken;
      tableau.connectionData = JSON.stringify({'accessToken': accessToken, 'src': 'myConnector.init'});

      if (tableau.phase == tableau.phaseEnum.gatherDataPhase) {

        console.log("myConnector.init in tableau.phaseEnum.gatherDataPhase: ", tableau.connectionData);

        var connectionData = JSON.parse(tableau.connectionData || "{}");

        $.ajaxSetup({
            beforeSend: function (xhr) {
               xhr.setRequestHeader('Authorization', "OAuth " + tableau.password);
            }
        });

        /*
        $.ajax({
        type: 'GET',
        url: '/hello/' + tableau.password,
        success: function onSuccess(resp) {
          //initCallback();
        }

      });
      */
    } // tableau.phaseEnum.gatherDataPhase


    initCallback();



      // If we are in the auth phase we only want to show the UI needed for auth
      if (tableau.phase == tableau.phaseEnum.authPhase) {
        //initCallback();
        tableau.submit();
      }

      if (tableau.phase == tableau.phaseEnum.interactivePhase) {
        tableau.password = accessToken;
      }



    $("#submitButton").click(function(e) {
      //e.preventDefault();

     //tableau.connectionName = "Foursquare Venues Data";
     //tableau.alwaysShowAuthUI = true;
     //tableau.connectionData = JSON.stringify({'accessToken': tableau.password, 'src': 'jquery ready'});

     tableau.submit();  // This ends the UI phase
   });


  };


  // Define the schema
  myConnector.getSchema = function(schemaCallback) {

    console.log("entry getSchema");

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

    console.log("before schemaCallback");
    schemaCallback([tableSchema]);
    console.log("after schemaCallback");
  };

  // Download the data

  myConnector.getData = function(table, doneCallback) {
    /*
    $.getJSON("tableau/data/centrale", function(data) {

      tableData = [];

      doneCallback(tableData);
    });
*/
    doneCallback([]);
  };


  tableau.registerConnector(myConnector);

})();
