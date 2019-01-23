(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  
  // data model
  var dm = [{
    id: 'ticker__given',
    alias: 'Ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'data__datestamp',
    alias: 'DATESTAMP',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'asset__NAME',
    alias: 'NAME',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__ID_ISIN',
    alias: 'ID_ISIN',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__CRNCY',
    alias: 'asset.CRNCY',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__GICS_SECTOR_NAME',
    alias: 'GICS_SECTOR_NAME',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__GICS_INDUSTRY_GROUP_NAME',
    alias: 'GICS_INDUSTRY_GROUP_NAME',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__GICS_INDUSTRY_NAME',
    alias: 'GICS_INDUSTRY_NAME',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__COUNTRY_ISO__ISOALPHA2Code',
    alias: 'COUNTRY__ISOALPHA2Code',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__COUNTRY_ISO__name',
    alias: 'COUNTRY_NAME',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__region__MatrixRegion',
    alias: 'REGION',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'derived__data__capiLocalCrncy__localValueInBln',
    alias: 'capiLocalInBln',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'derived__data__capiBaseCrncy__baseValueInBln',
    alias: 'capiBaseInBln',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__VOLATILITY_90D',
    alias: 'VOLATILITY_90D',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__CHG_PCT_1YR',
    alias: 'CHG_PCT_1YR',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__REL_1M',
    alias: 'REL_1M',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__REL_3M',
    alias: 'REL_3M',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__PX_LAST',
    alias: 'PX_LAST',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__CHG_PCT_5D',
    alias: 'CHG_PCT_5D',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__CHG_PCT_30D',
    alias: 'CHG_PCT_30D',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__CHG_PCT_100D',
    alias: 'CHG_PCT_100D',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__CHG_PCT_YTD',
    alias: 'CHG_PCT_YTD',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__RSI_14D',
    alias: 'RSI_14D',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__MOV_AVG_20D',
    alias: 'MOV_AVG_20D',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__MOV_AVG_50D',
    alias: 'MOV_AVG_50D',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__MOV_AVG_200D',
    alias: 'MOV_AVG_200D',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__HIGH_52WEEK',
    alias: 'HIGH_52WEEK',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__LOW_52WEEK',
    alias: 'LOW_52WEEK',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__NET_DEBT_TO_EBITDA',
    alias: 'NET_DEBT_TO_EBITDA',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_EPS_3MO_PCT_CHG',
    alias: 'BEST_EPS_3MO_PCT_CHG',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_EPS_6MO_PCT_CHG',
    alias: 'BEST_EPS_6MO_PCT_CHG',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__EPS_SURPRISE_LAST_QTR',
    alias: 'EPS_SURPRISE_LAST_QTR',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__EPS_SURPRISE_LAST_ANNUAL',
    alias: 'EPS_SURPRISE_LAST_ANNUAL',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__HIST_PUT_IMP_VOL',
    alias: 'HIST_PUT_IMP_VOL',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_TARGET_3MO_CHG',
    alias: 'BEST_TARGET_3MO_CHG',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__LATEST_ANN_DT_QTRLY',
    alias: 'LATEST_ANN_DT_QTRLY',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'raw__sources__bbg__data__EXPECTED_REPORT_DT',
    alias: 'EXPECTED_REPORT_DT',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'raw__sources__bbg__data__EXPECTED_REPORT_TIME',
    alias: 'EXPECTED_REPORT_TIME',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'raw__sources__bbg__data__SKEW_MONEYNESS_SPREAD',
    alias: 'SKEW_MONEYNESS_SPREAD',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__EARNINGS_RELATED_IMPLIED_MOVE',
    alias: 'EARNINGS_RELATED_IMPLIED_MOVE',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__PUT_CALL_OPEN_INTEREST_RATIO',
    alias: 'PUT_CALL_OPEN_INTEREST_RATIO',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__1M_SHORT_INT_PCT',
    alias: '1M_SHORT_INT_PCT',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__PX_TO_CASH_FLOW',
    alias: 'PX_TO_CASH_FLOW',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_PE_RATIO',
    alias: 'BEST_PE_RATIO',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_PX_SALES_RATIO',
    alias: 'PX_SALES_RATIO',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__FIVE_YEAR_AVG_PRICE_SALES',
    alias: 'FIVE_YEAR_AVG_PRICE_SALES',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__EV_TO_T12M_SALES',
    alias: 'EV_TO_T12M_SALES',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_PX_CPS_RATIO',
    alias: 'BEST_PX_CPS_RATIO',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__FIVE_YEAR_AVG_PRICE_CASHFLOW',
    alias: 'FIVE_YEAR_AVG_PRICE_CASHFLOW',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_CURRENT_EV_BEST_SALES',
    alias: 'BEST_CURRENT_EV_BEST_SALES',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_CUR_EV_TO_EBITDA',
    alias: 'BEST_CUR_EV_TO_EBITDA',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__PE_RATIO',
    alias: 'PE_RATIO',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__FIVE_YR_AVG_PRICE_EARNINGS',
    alias: 'FIVE_YR_AVG_PRICE_EARNINGS',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_DIV_YLD',
    alias: 'BEST_DIV_YLD',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'models__GROWTH__CURRENT_EPSMthChg',
    src: 'models.GROWTH.components.CURRENT_EPSMthChg.intermediary_score',
    alias: 'GROWTH__CURRENT_EPSMthChg',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__PAST_EPSStability',
    src: 'models.GROWTH.components.PAST_EPSStability.intermediary_score',
    alias: 'GROWTH__PAST_EPSStability',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__CURRENT_BEstEPS4WeekChangeNextYear',
    src: 'models.GROWTH.components.CURRENT_BEstEPS4WeekChangeNextYear.intermediary_score',
    alias: 'GROWTH__CURRENT_BEstEPS4WeekChangeNextYear',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__PAST_EPSGrowthYr',
    src: 'models.GROWTH.components.PAST_EPSGrowthYr.intermediary_score',
    alias: 'GROWTH__PAST_EPSGrowthYr',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__CURRENT_BEstEPS4WeekChangeCurrentYear',
    src: 'models.GROWTH.components.CURRENT_BEstEPS4WeekChangeCurrentYear.intermediary_score',
    alias: 'GROWTH__CURRENT_BEstEPS4WeekChangeCurrentYear',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__NEXT_EPSGrowth',
    src: 'models.GROWTH.components.NEXT_EPSGrowth.intermediary_score',
    alias: 'GROWTH__NEXT_EPSGrowth',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__CURRENT_RatioEPSCurrentYearLastEPS',
    src: 'models.GROWTH.components.CURRENT_RatioEPSCurrentYearLastEPS.intermediary_score',
    alias: 'GROWTH__CURRENT_RatioEPSCurrentYearLastEPS',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__CURRENT_EPSSurprise',
    src: 'models.GROWTH.components.CURRENT_EPSSurprise.intermediary_score',
    alias: 'GROWTH__CURRENT_EPSSurprise',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__CURRENT_RatioEPSNextYrCurrentYr',
    src: 'models.GROWTH.components.CURRENT_RatioEPSNextYrCurrentYr.intermediary_score',
    alias: 'GROWTH__CURRENT_RatioEPSNextYrCurrentYr',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__scoring__final_score',
    alias: 'GROWTH',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__EPS__scoring__final_score',
    alias: 'EPS',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__MF__scoring__final_score',
    alias: 'MF',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RSST__scoring__final_score',
    alias: 'RSST',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__LOWVOL__scoring__final_score',
    alias: 'LOWVOL',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__rEPS__scoring__final_score',
    alias: 'rEPS',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__rMF__scoring__final_score',
    alias: 'rMF',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__rRSST__scoring__final_score',
    alias: 'rRSST',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__rLOWVOL__scoring__final_score',
    alias: 'rLOWVOL',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__PX_TO_CASH_FLOW',
    src: 'models.RV.components.PX_TO_CASH_FLOW.intermediary_score',
    alias: 'RV__PX_TO_CASH_FLOW',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__BEST_PE_RATIO',
    src: 'models.RV.components.PE_RATIO.intermediary_score',
    alias: 'RV__BEST_PE_RATIO',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__Ratio__BEST_PX_SALES_RATIO__FIVE_YEAR_AVG_PRICE_SALES',
    src: 'models.RV.components.BEST_PX_SALES_RATIO/FIVE_YEAR_AVG_PRICE_SALES.intermediary_score',
    alias: 'RV__Ratio__BEST_PX_SALES_RATIO__FIVE_YEAR_AVG_PRICE_SALES',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__EV_TO_T12M_SALES',
    src: 'models.RV.components.EV_TO_T12M_SALES.intermediary_score',
    alias: 'RV__EV_TO_T12M_SALES',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__Ratio__BEST_PX_CPS_RATIO__FIVE_YEAR_AVG_PRICE_CASHFLOW',
    src: 'models.RV.components.BEST_PX_CPS_RATIO/FIVE_YEAR_AVG_PRICE_CASHFLOW.intermediary_score',
    alias: 'RV__Ratio__BEST_PX_CPS_RATIO__FIVE_YEAR_AVG_PRICE_CASHFLOW',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__BEST_CURRENT_EV_BEST_SALES',
    src: 'models.RV.components.BEST_CURRENT_EV_BEST_SALES.intermediary_score',
    alias: 'RV__BEST_CURRENT_EV_BEST_SALES',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__BEST_CUR_EV_TO_EBITDA',
    src: 'models.RV.components.BEST_CUR_EV_TO_EBITDA.intermediary_score',
    alias: 'RV__BEST_CUR_EV_TO_EBITDA',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__PE_RATIO',
    src: 'models.RV.components.PE_RATIO.intermediary_score',
    alias: 'RV__PE_RATIO',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__Ratio__BEST_PE_RATIO__FIVE_YR_AVG_PRICE_EARNINGS',
    src: 'models.RV.components.BEST_PE_RATIO/FIVE_YR_AVG_PRICE_EARNINGS.intermediary_score',
    alias: 'RV__Ratio__BEST_PE_RATIO__FIVE_YR_AVG_PRICE_EARNINGS',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__BEST_DIV_YLD',
    src: 'models.RV.components.BEST_DIV_YLD.intermediary_score',
    alias: 'RV__BEST_DIV_YLD',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__Ratio__PX_TO_CASH_FLOW__FIVE_YEAR_AVG_PRICE_CASHFLOW',
    src: 'models.RV.components.PX_TO_CASH_FLOW/FIVE_YEAR_AVG_PRICE_CASHFLOW.intermediary_score',
    alias: 'RV__Ratio__PX_TO_CASH_FLOW__FIVE_YEAR_AVG_PRICE_CASHFLOW',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__scoring__final_score',
    alias: 'RV',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__EQ__scoring__final_score',
    alias: 'EQ',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__SALES__scoring__final_score',
    alias: 'SALES',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__SMARTSENT__scoring__final_score',
    alias: 'SMARTSENT',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__GROWTH__scoring__chg__1m',
    alias: 'GROWTH chg 1m',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__MF__scoring__chg__1m',
    alias: 'MF chg 1m',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RSST__scoring__chg__1m',
    alias: 'RSST chg 1m',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__RV__scoring__chg__1m',
    alias: 'RV chg 1m',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__EQ__scoring__chg__1m',
    alias: 'EQ chg 1m',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__SALES__scoring__chg__1m',
    alias: 'SALES chg 1m',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__SMARTSENT__scoring__chg__1m',
    alias: 'SMARTSENT chg 1m',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__rEPS__scoring__chg__previous',
    alias: 'rEPS chg previous',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__rMF__scoring__chg__previous',
    alias: 'rMF chg previous',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__rLOWVOL__scoring__chg__previous',
    alias: 'rLOWVOL chg previous',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'models__rRSST__scoring__chg__previous',
    alias: 'rRSST chg previous',
    dataType: tableau.dataTypeEnum.int
  }];



  // Define the schema
  myConnector.getSchema = function(schemaCallback) {

    var tableSchema = {
      id: 'centraleFeed',
      alias: 'Centrale last run',
      columns: dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
    };

    schemaCallback([tableSchema]);
  };

  // Download the data
  myConnector.getData = function(table, doneCallback) {

    var connectionDataObj = tableau.connectionData ? JSON.parse(tableau.connectionData) : {host: 'tableau/data/centrale'};

    $.getJSON(connectionDataObj.host, function(data) {

      tableData = data.map( function(company) {
        var company_data = {};
        for (var field in dm) { // loop on indexes
          company_data[ dm[field].id ] = dm[field].hasOwnProperty('src') ? company[ dm[field].src ] : company[ dm[field].id.replace(/__/g, '.') ];
        }
        return company_data;
      } )

      table.appendRows(tableData);
      doneCallback();
    });
  };

  tableau.registerConnector(myConnector);


  // Create event listeners for when the user submits the form
  $(document).ready(function() {
    $('#submitButton').click(function() {
      tableau.connectionName = 'Centrale Feed'; // This will be the data source name in Tableau
      tableau.submit(); // This sends the connector object to Tableau
    });


    $('.scregionmodel').on('click',function() {
      tableau.connectionData = JSON.stringify( {host: '/tableau/data/sc/region/' + $(this).data('region') + '/model/' + $(this).data('model') } );
      tableau.connectionName = 'Centrale Feed'; // This will be the data source name in Tableau
      tableau.submit(); // This sends the connector object to Tableau
    });

  });
})();
