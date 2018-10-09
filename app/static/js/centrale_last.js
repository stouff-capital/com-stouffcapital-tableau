(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();

  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
    var cols = [{
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
      id: 'raw__sources__bbg__data__PX_SALES_RATIO',
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
      alias: 'GROWTH__CURRENT_EPSMthChg',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__GROWTH__PAST_EPSStability',
      alias: 'GROWTH__PAST_EPSStability',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__GROWTH__CURRENT_BEstEPS4WeekChangeNextYear',
      alias: 'GROWTH__CURRENT_BEstEPS4WeekChangeNextYear',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__GROWTH__PAST_EPSGrowthYr',
      alias: 'GROWTH__PAST_EPSGrowthYr',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__GROWTH__CURRENT_BEstEPS4WeekChangeCurrentYear',
      alias: 'GROWTH__CURRENT_BEstEPS4WeekChangeCurrentYear',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__GROWTH__NEXT_EPSGrowth',
      alias: 'GROWTH__NEXT_EPSGrowth',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__GROWTH__CURRENT_RatioEPSCurrentYearLastEPS',
      alias: 'GROWTH__CURRENT_RatioEPSCurrentYearLastEPS',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__GROWTH__CURRENT_EPSSurprise',
      alias: 'GROWTH__CURRENT_EPSSurprise',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__GROWTH__CURRENT_RatioEPSNextYrCurrentYr',
      alias: 'GROWTH__CURRENT_RatioEPSNextYrCurrentYr',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__GROWTH__scoring__final_score',
      alias: 'GROWTH',
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
      id: 'models__RV__PX_TO_CASH_FLOW',
      alias: 'RV__PX_TO_CASH_FLOW',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__BEST_PE_RATIO',
      alias: 'RV__BEST_PE_RATIO',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__Ratio__BEST_PX_SALES_RATIO__FIVE_YEAR_AVG_PRICE_SALES',
      alias: 'RV__Ratio__BEST_PX_SALES_RATIO__FIVE_YEAR_AVG_PRICE_SALES',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__EV_TO_T12M_SALES',
      alias: 'RV__EV_TO_T12M_SALES',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__Ratio__BEST_PX_CPS_RATIO__FIVE_YEAR_AVG_PRICE_CASHFLOW',
      alias: 'RV__Ratio__BEST_PX_CPS_RATIO__FIVE_YEAR_AVG_PRICE_CASHFLOW',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__BEST_CURRENT_EV_BEST_SALES',
      alias: 'RV__BEST_CURRENT_EV_BEST_SALES',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__BEST_CUR_EV_TO_EBITDA',
      alias: 'RV__BEST_CUR_EV_TO_EBITDA',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__PE_RATIO',
      alias: 'RV__PE_RATIO',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__Ratio__BEST_PE_RATIO__FIVE_YR_AVG_PRICE_EARNINGS',
      alias: 'RV__Ratio__BEST_PE_RATIO__FIVE_YR_AVG_PRICE_EARNINGS',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__BEST_DIV_YLD',
      alias: 'RV__BEST_DIV_YLD',
      dataType: tableau.dataTypeEnum.int
    }, {
      id: 'models__RV__Ratio__PX_TO_CASH_FLOW__FIVE_YEAR_AVG_PRICE_CASHFLOW',
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
    }];

    var tableSchema = {
      id: 'centraleFeed',
      alias: 'Centrale last run',
      columns: cols
    };

    schemaCallback([tableSchema]);
  };

  // Download the data
  myConnector.getData = function(table, doneCallback) {

    var connectionDataObj = tableau.connectionData ? JSON.parse(tableau.connectionData) : {host: 'tableau/data/centrale'};

    $.getJSON(connectionDataObj.host, function(data) {
      tableData = [];

      // Iterate over the JSON object
      for (var i = 0, len = data.length; i < len; i++) {

        tableData.push({
          'ticker__given': data[i]['ticker.given'],
          'data__datestamp': data[i]['_index'].replace(/\./g, '-').replace('central-', ''),
          'asset__NAME': data[i]['asset.NAME'],
          'asset__ID_ISIN': data[i]['asset.ID_ISIN'],
          'asset__CRNCY': data[i]['asset.CRNCY'],
          'asset__GICS_SECTOR_NAME': data[i]['asset.GICS_SECTOR_NAME'],
          'asset__GICS_INDUSTRY_GROUP_NAME': data[i]['asset.GICS_INDUSTRY_GROUP_NAME'],
          'asset__GICS_INDUSTRY_NAME': data[i]['asset.GICS_INDUSTRY_NAME'],
          'asset__COUNTRY_ISO__ISOALPHA2Code': data[i]['asset.COUNTRY_ISO.ISOALPHA2Code'],
          'asset__COUNTRY_ISO__name': data[i]['asset.COUNTRY_ISO.name'],
          'asset__region__MatrixRegion': data[i]['asset.region.MatrixRegion'],
          'derived__data__capiBaseCrncy__baseValueInBln': data[i]['derived.data.capiBaseCrncy.baseValueInBln'],
          'raw__sources__bbg__data__VOLATILITY_90D': data[i]['raw.sources.bbg.data.VOLATILITY_90D'],
          'raw__sources__bbg__data__CHG_PCT_1YR': data[i]['raw.sources.bbg.data.CHG_PCT_1YR'],
          'raw__sources__bbg__data__REL_1M': data[i]['raw.sources.bbg.data.REL_1M'],
          'raw__sources__bbg__data__REL_3M': data[i]['raw.sources.bbg.data.REL_3M'],

          'raw__sources__bbg__data__HIST_PUT_IMP_VOL': data[i]['raw.sources.bbg.data.HIST_PUT_IMP_VOL'],
          'raw__sources__bbg__data__BEST_TARGET_3MO_CHG': data[i]['raw.sources.bbg.data.BEST_TARGET_3MO_CHG'],
          'raw__sources__bbg__data__LATEST_ANN_DT_QTRLY': data[i]['raw.sources.bbg.data.LATEST_ANN_DT_QTRLY'],
          'raw__sources__bbg__data__EXPECTED_REPORT_DT': data[i]['raw.sources.bbg.data.EXPECTED_REPORT_DT'],
          'raw__sources__bbg__data__EXPECTED_REPORT_TIME': data[i]['raw.sources.bbg.data.EXPECTED_REPORT_TIME'],
          'raw__sources__bbg__data__SKEW_MONEYNESS_SPREAD': data[i]['raw.sources.bbg.data.SKEW_MONEYNESS_SPREAD'],
          'raw__sources__bbg__data__EARNINGS_RELATED_IMPLIED_MOVE': data[i]['raw.sources.bbg.data.EARNINGS_RELATED_IMPLIED_MOVE'],
          'raw__sources__bbg__data__PUT_CALL_OPEN_INTEREST_RATIO': data[i]['raw.sources.bbg.data.PUT_CALL_OPEN_INTEREST_RATIO'],
          'raw__sources__bbg__data__1M_SHORT_INT_PCT': data[i]['raw.sources.bbg.data.1M_SHORT_INT_PCT'],

          'raw__sources__bbg__data__PX_TO_CASH_FLOW': data[i]['raw.sources.bbg.data.PX_TO_CASH_FLOW'],
          'raw__sources__bbg__data__BEST_PE_RATIO': data[i]['raw.sources.bbg.data.BEST_PE_RATIO'],
          'raw__sources__bbg__data__PX_SALES_RATIO': data[i]['raw.sources.bbg.data.BEST_PX_SALES_RATIO'],
          'raw__sources__bbg__data__FIVE_YEAR_AVG_PRICE_SALES': data[i]['raw.sources.bbg.data.FIVE_YEAR_AVG_PRICE_SALES'],
          'raw__sources__bbg__data__EV_TO_T12M_SALES': data[i]['raw.sources.bbg.data.EV_TO_T12M_SALES'],
          'raw__sources__bbg__data__BEST_PX_CPS_RATIO': data[i]['raw.sources.bbg.data.BEST_PX_CPS_RATIO'],
          'raw__sources__bbg__data__FIVE_YEAR_AVG_PRICE_CASHFLOW': data[i]['raw.sources.bbg.data.FIVE_YEAR_AVG_PRICE_CASHFLOW'],
          'raw__sources__bbg__data__BEST_CURRENT_EV_BEST_SALES': data[i]['raw.sources.bbg.data.BEST_CURRENT_EV_BEST_SALES'],
          'raw__sources__bbg__data__BEST_CUR_EV_TO_EBITDA': data[i]['raw.sources.bbg.data.BEST_CUR_EV_TO_EBITDA'],
          'raw__sources__bbg__data__PE_RATIO': data[i]['raw.sources.bbg.data.PE_RATIO'],
          'raw__sources__bbg__data__FIVE_YR_AVG_PRICE_EARNINGS': data[i]['raw.sources.bbg.data.FIVE_YR_AVG_PRICE_EARNINGS'],
          'raw__sources__bbg__data__BEST_DIV_YLD': data[i]['raw.sources.bbg.data.BEST_DIV_YLD'],

          'models__GROWTH__CURRENT_EPSMthChg': data[i]['models.GROWTH.components.CURRENT_EPSMthChg.intermediary_score'],
          'models__GROWTH__PAST_EPSStability': data[i]['models.GROWTH.components.PAST_EPSStability.intermediary_score'],
          'models__GROWTH__CURRENT_BEstEPS4WeekChangeNextYear': data[i]['models.GROWTH.components.CURRENT_BEstEPS4WeekChangeNextYear.intermediary_score'],
          'models__GROWTH__PAST_EPSGrowthYr': data[i]['models.GROWTH.components.PAST_EPSGrowthYr.intermediary_score'],
          'models__GROWTH__CURRENT_BEstEPS4WeekChangeCurrentYear': data[i]['models.GROWTH.components.CURRENT_BEstEPS4WeekChangeCurrentYear.intermediary_score'],
          'models__GROWTH__NEXT_EPSGrowth': data[i]['models.GROWTH.components.NEXT_EPSGrowth.intermediary_score'],
          'models__GROWTH__CURRENT_RatioEPSCurrentYearLastEPS': data[i]['models.GROWTH.components.CURRENT_RatioEPSCurrentYearLastEPS.intermediary_score'],
          'models__GROWTH__CURRENT_EPSSurprise': data[i]['models.GROWTH.components.CURRENT_EPSSurprise.intermediary_score'],
          'models__GROWTH__CURRENT_RatioEPSNextYrCurrentYr': data[i]['models.GROWTH.components.CURRENT_RatioEPSNextYrCurrentYr.intermediary_score'],

          'models__GROWTH__scoring__final_score': data[i]['models.GROWTH.scoring.final_score'],

          'models__MF__scoring__final_score': data[i]['models.MF.scoring.final_score'],

          'models__RSST__scoring__final_score': data[i]['models.RSST.scoring.final_score'],

          'models__RV__PX_TO_CASH_FLOW': data[i]['models.RV.components.PX_TO_CASH_FLOW.intermediary_score'],
          'models__RV__BEST_PE_RATIO': data[i]['models.RV.components.BEST_PE_RATIO.intermediary_score'],
          'models__RV__Ratio__BEST_PX_SALES_RATIO__FIVE_YEAR_AVG_PRICE_SALES': data[i]['models.RV.components.BEST_PX_SALES_RATIO/FIVE_YEAR_AVG_PRICE_SALES.intermediary_score'],
          'models__RV__EV_TO_T12M_SALES': data[i]['models.RV.components.EV_TO_T12M_SALES.intermediary_score'],
          'models__RV__Ratio__BEST_PX_CPS_RATIO__FIVE_YEAR_AVG_PRICE_CASHFLOW': data[i]['models.RV.components.BEST_PX_CPS_RATIO/FIVE_YEAR_AVG_PRICE_CASHFLOW.intermediary_score'],
          'models__RV__BEST_CURRENT_EV_BEST_SALES': data[i]['models.RV.components.BEST_CURRENT_EV_BEST_SALES.intermediary_score'],
          'models__RV__BEST_CUR_EV_TO_EBITDA': data[i]['models.RV.components.BEST_CUR_EV_TO_EBITDA.intermediary_score'],
          'models__RV__PE_RATIO': data[i]['models.RV.components.PE_RATIO.intermediary_score'],
          'models__RV__Ratio__BEST_PE_RATIO__FIVE_YR_AVG_PRICE_EARNINGS': data[i]['models.RV.components.BEST_PE_RATIO/FIVE_YR_AVG_PRICE_EARNINGS.intermediary_score'],
          'models__RV__BEST_DIV_YLD': data[i]['models.RV.components.BEST_DIV_YLD.intermediary_score'],
          'models__RV__Ratio__PX_TO_CASH_FLOW__FIVE_YEAR_AVG_PRICE_CASHFLOW': data[i]['models.RV.components.PX_TO_CASH_FLOW/FIVE_YEAR_AVG_PRICE_CASHFLOW.intermediary_score'],

          'models__RV__scoring__final_score': data[i]['models.RV.scoring.final_score'],

          'models__EQ__scoring__final_score': data[i]['models.EQ.scoring.final_score'],

          'models__SALES__scoring__final_score': data[i]['models.SALES.scoring.final_score'],

          'models__SMARTSENT__scoring__final_score': data[i]['models.SMARTSENT.scoring.final_score'],

          'models__GROWTH__scoring__chg__1m': data[i]['models.GROWTH.scoring.chg.1m'],
          'models__MF__scoring__chg__1m': data[i]['models.MF.scoring.chg.1m'],
          'models__RSST__scoring__chg__1m': data[i]['models.RSST.scoring.chg.1m'],
          'models__RV__scoring__chg__1m': data[i]['models.RV.scoring.chg.1m'],
          'models__EQ__scoring__chg__1m': data[i]['models.EQ.scoring.chg.1m'],
          'models__SALES__scoring__chg__1m': data[i]['models.SALES.scoring.chg.1m'],
          'models__SMARTSENT__scoring__chg__1m': data[i]['models.SMARTSENT.scoring.chg.1m'],

        });
      }

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
