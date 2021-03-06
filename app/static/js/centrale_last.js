(function() {
  // Create the connector object
  var myConnector = tableau.makeConnector();


  // data models
  var centralFeed_dm = [{
    id: 'ticker__given',
    alias: 'Ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'data__datestamp',
    alias: 'DATESTAMP',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'reactiveData_date',
    alias: 'REACTIVEDATESTAMP',
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
    id: 'raw__sources__bbg__data__REL_5D',
    alias: 'REL_5D',
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
    id: 'raw__sources__bbg__data__45_DAY_HIGH',
    alias: '45_DAY_HIGH',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__45_DAY_LOW',
    alias: '45_DAY_LOW',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_PE_RATIO__CY4',
    alias: 'BEST_PE_RATIO@CY+4',
    src: 'raw.sources.bbg.data.BEST_PE_RATIO@CY+4',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__NET_DEBT_TO_EBITDA',
    alias: 'NET_DEBT_TO_EBITDA',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__earningsHistory__averageAbsPxChg',
    src: 'averageAbsPxChg',
    alias: 'earningsHistory_averageAbsPxChg',
    dataType: tableau.dataTypeEnum.float,
    numberFormat: tableau.numberFormatEnum.percentage
  }, {
    id: 'raw__sources__bbg__earningsHistory__averageAbsSurp',
    src: 'averageAbsSurp',
    alias: 'earningsHistory_averageAbsSurp',
    dataType: tableau.dataTypeEnum.float,
    numberFormat: tableau.numberFormatEnum.percentage
  }, {
    id: 'raw__sources__bbg__earningsHistory__averageSurp',
    src: 'averageSurp',
    alias: 'earningsHistory_averageSurp',
    dataType: tableau.dataTypeEnum.float,
    numberFormat: tableau.numberFormatEnum.percentage
  }, {
    id: 'raw__sources__bbg__earningsHistory__implied1DayMove',
    src: 'implied1DayMove',
    alias: 'earningsHistory_implied1DayMove',
    dataType: tableau.dataTypeEnum.float,
    numberFormat: tableau.numberFormatEnum.percentage
  }, {
    id: 'raw__sources__bbg__earningsHistory__surpPxChgCorr',
    src: 'surpPxChgCorr',
    alias: 'earningsHistory_surpPxChgCorr',
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
    id: 'raw__sources__bbg__data__BEST_TARGET_PRICE',
    alias: 'BEST_TARGET_PRICE',
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
    id: 'raw__sources__bbg__data__VOL_PERCENTILE',
    alias: 'VOL_PERCENTILE',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__BEST_EPS_4WK_PCT_CHG',
    alias: 'BEST_EPS_4WK_PCT_CHG',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'raw__sources__bbg__data__EQY_RAW_BETA_6M',
    alias: 'EQY_RAW_BETA_6M',
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


  var centralHisto_dm = [{
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
    id: 'asset__CRNCY',
    alias: 'asset.CRNCY',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__GICS_SECTOR_NAME',
    alias: 'GICS_SECTOR_NAME',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__COUNTRY_ISO__ISOALPHA2Code',
    alias: 'COUNTRY__ISOALPHA2Code',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset__region__MatrixRegion',
    alias: 'REGION',
    dataType: tableau.dataTypeEnum.string
  }/*, {
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
    id: 'models__GROWTH__scoring_pct_not_cover',
    src: 'models.GROWTH.scoring.pct_not_cover',
    alias: ' GROWTH scoring pct not_cover',
    dataType: tableau.dataTypeEnum.float
  }*/];

  var model_GROWTH_components = [
    'CURRENT_BEstEPS4WeekChangeCurrentYear',
    'CURRENT_BEstEPS4WeekChangeNextYear',
    'CURRENT_EPSMthChg',
    'CURRENT_EPSSurprise',
    'CURRENT_RatioEPSCurrentYearLastEPS',
    'CURRENT_RatioEPSNextYrCurrentYr',
    'NEXT_EPSGrowth',
    'PAST_EPSGrowthYr',
    'PAST_EPSStability'
  ]


  for (var indx in model_GROWTH_components) { // loop on indexes

    var c_headers = [
      {field: 'eval', type: tableau.dataTypeEnum.string, alias: 'GROWTH ' + model_GROWTH_components[indx] + ' eval'},
      {field: 'error', type: tableau.dataTypeEnum.string, alias: 'GROWTH ' + model_GROWTH_components[indx] + ' error'},
      {field: 'intermediary_score', type: tableau.dataTypeEnum.int, alias: 'GROWTH ' + model_GROWTH_components[indx]}
    ];

    for (var h_indx in c_headers) {
      centralHisto_dm.push( {
        id: 'models__GROWTH__components__' + model_GROWTH_components[indx] + '__' + c_headers[h_indx].field,
        src: 'models.GROWTH.components.' + model_GROWTH_components[indx] + '.' + c_headers[h_indx].field,
        alias: c_headers[h_indx].alias,
        dataType: c_headers[h_indx].type
      } );
    }


    centralHisto_dm.push( {
      id: 'models__GROWTH__components__' + model_GROWTH_components[indx] + '__weight',
      src: 'models.GROWTH.scoring.weights.' + model_GROWTH_components[indx],
      alias: 'GROWTH ' + model_GROWTH_components[indx] + ' weight',
      dataType: tableau.dataTypeEnum.float
    } );

  }


  centralHisto_dm.push({
    id: 'models__GROWTH__scoring__final_score',
    alias: 'GROWTH',
    dataType: tableau.dataTypeEnum.int
  });

  centralHisto_dm.push({
    id: 'models__GROWTH__scoring_pct_not_cover',
    src: 'models.GROWTH.scoring.pct_not_cover',
    alias: ' GROWTH scoring pct not_cover',
    dataType: tableau.dataTypeEnum.float
  });




  var centralStatics_dm = [{
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
  }];


  var earningsHistory_dm = [{
    id: 'ticker',
    alias: 'Ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'ann_date',
    alias: 'ann_date',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'comp',
    alias: 'Comparable',
    dataType: tableau.dataTypeEnum.float,
    numberFormat: tableau.numberFormatEnum.percentage
  }, {
    id: 'estimate',
    alias: 'Consensus Estimate',
    dataType: tableau.dataTypeEnum.float,
    numberFormat: tableau.numberFormatEnum.currency
  }, {
    id: 'surprise',
    alias: 'Surprise',
    dataType: tableau.dataTypeEnum.float,
    numberFormat: tableau.numberFormatEnum.percentage
  }];

  var cboeFuturesVix_dm = [{
    id: 'name',
    alias: 'name',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'Futures',
    alias: 'Futures',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'url',
    alias: 'url',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'expiry',
    alias: 'expiry',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'Trade_Date',
    alias: 'Trade_Date',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'Open',
    alias: 'Open',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'High',
    alias: 'High',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'Low',
    alias: 'Low',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'Close',
    alias: 'Close',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'Settle',
    alias: 'Settle',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'Change',
    alias: 'Change',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'Total_Volume',
    alias: 'Total_Volume',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'EFP',
    alias: 'EFP',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'Open_Interest',
    alias: 'Open_Interest',
    dataType: tableau.dataTypeEnum.int
  }];


  var ibsymbology_dm = [{
    id: 'bbgIdentifier',
    alias: 'bbgIdentifier',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'bbgUnderylingId',
    alias: 'bbgUnderylingId',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'contract_conid',
    alias: 'contract_conid',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'contract_symbol',
    alias: 'contract_symbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'internalUnderlying',
    alias: 'internalUnderlying',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'ticker',
    alias: 'ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlyingBloombergTicker',
    alias: 'underlyingBloombergTicker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'exposureType',
    alias: 'exposureType',
    dataType: tableau.dataTypeEnum.string
  }];


  var ibnav_dm = [{
    id: 'reportDate',
    alias: 'reportDate',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'cash',
    alias: 'cash',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'brokerCashComponent',
    alias: 'brokerCashComponent',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'fdicInsuredBankSweepAccountCashComponent',
    alias: 'fdicInsuredBankSweepAccountCashComponent',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'slbCashCollateral',
    alias: 'slbCashCollateral',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'stock',
    alias: 'stock',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'slbDirectSecuritiesBorrowed',
    alias: 'slbDirectSecuritiesBorrowed',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'slbDirectSecuritiesLent',
    alias: 'slbDirectSecuritiesLent',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'options',
    alias: 'options',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'bonds',
    alias: 'bonds',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'commodities',
    alias: 'commodities',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'notes',
    alias: 'notes',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'funds',
    alias: 'funds',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'dividendAccruals',
    alias: 'dividendAccruals',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'interestAccruals',
    alias: 'interestAccruals',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'brokerInterestAccrualsComponent',
    alias: 'brokerInterestAccrualsComponent',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'fdicInsuredAccountInterestAccrualsComponent',
    alias: 'fdicInsuredAccountInterestAccrualsComponent',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'softDollars',
    alias: 'softDollars',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'forexCfdUnrealizedPl',
    alias: 'forexCfdUnrealizedPl',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'cfdUnrealizedPl',
    alias: 'cfdUnrealizedPl',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'total',
    alias: 'total',
    dataType: tableau.dataTypeEnum.float
  }];


  var ibPnl_dm = [{
    id: 'accountId',
    alias: 'accountId',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'reportDate',
    alias: 'reportDate',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'assetCategory',
    alias: 'assetCategory',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'conid',
    alias: 'conid',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'symbol',
    alias: 'symbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'description',
    alias: 'description',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'putCall',
    alias: 'putCall',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'strike',
    alias: 'strike',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'expiry',
    alias: 'expiry',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'listingExchange',
    alias: 'listingExchange',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'isin',
    alias: 'isin',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'multiplier',
    alias: 'multiplier',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'principalAdjustFactor',
    alias: 'principalAdjustFactor',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'underlyingConid',
    alias: 'underlyingConid',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'underlyingSymbol',
    alias: 'underlyingSymbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlyingSecurityID',
    alias: 'underlyingSecurityID',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlyingListingExchange',
    alias: 'underlyingListingExchange',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'closeQuantity',
    alias: 'closeQuantity',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'closePrice',
    alias: 'closePrice',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'commissions',
    alias: 'commissions',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'other',
    alias: 'other',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'prevCloseQuantity',
    alias: 'prevCloseQuantity',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'prevClosePrice',
    alias: 'prevClosePrice',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'priorOpenMtm',
    alias: 'priorOpenMtm',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'transactionMtm',
    alias: 'transactionMtm',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'total',
    alias: 'total',
    dataType: tableau.dataTypeEnum.float
  }];


  var ibPosition_dm = [{
    id: 'accountId',
    alias: 'accountId',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'reportDate',
    alias: 'reportDate',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'assetCategory',
    alias: 'assetCategory',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'conid',
    alias: 'conid',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'symbol',
    alias: 'symbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'description',
    alias: 'description',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'currency',
    alias: 'currency',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'putCall',
    alias: 'putCall',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'strike',
    alias: 'strike',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'expiry',
    alias: 'expiry',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'listingExchange',
    alias: 'listingExchange',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'isin',
    alias: 'isin',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'multiplier',
    alias: 'multiplier',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'underlyingConid',
    alias: 'underlyingConid',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'underlyingSymbol',
    alias: 'underlyingSymbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlyingSecurityID',
    alias: 'underlyingSecurityID',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlyingListingExchange',
    alias: 'underlyingListingExchange',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'side',
    alias: 'side',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'position',
    alias: 'position',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'positionValue',
    alias: 'positionValue',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'markPrice',
    alias: 'markPrice',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'percentOfNAV',
    alias: 'percentOfNAV',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'fxRateToBase',
    alias: 'fxRateToBase',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'openPrice',
    alias: 'openPrice',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'costBasisPrice',
    alias: 'costBasisPrice',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'costBasisMoney',
    alias: 'costBasisMoney',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'fifoPnlUnrealized',
    alias: 'fifoPnlUnrealized',
    dataType: tableau.dataTypeEnum.float
  }];


  var ibExecution_dm = [{
    id: 'accountId',
    alias: 'accountId',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'assetCategory',
    alias: 'assetCategory',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'buySell',
    alias: 'buySell',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'changeInPrice',
    alias: 'changeInPrice',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'changeInQuantity',
    alias: 'changeInQuantity',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'closePrice',
    alias: 'closePrice',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'conid',
    alias: 'conid',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'cost',
    alias: 'cost',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'currency',
    alias: 'currency',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'description',
    alias: 'description',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'exchange',
    alias: 'exchange',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'expiry',
    alias: 'expiry',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'extExecID',
    alias: 'extExecID',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'fifoPnlRealized',
    alias: 'fifoPnlRealized',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'fxPnl',
    alias: 'fxPnl',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'fxRateToBase',
    alias: 'fxRateToBase',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'ibCommission',
    alias: 'ibCommission',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'ibCommissionCurrency',
    alias: 'ibCommissionCurrency',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'ibExecID',
    alias: 'ibExecID',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'ibOrderID',
    alias: 'ibOrderID',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'isAPIOrder',
    alias: 'isAPIOrder',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'isin',
    alias: 'isin',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'issuer',
    alias: 'issuer',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'listingExchange',
    alias: 'listingExchange',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'mtmPnl',
    alias: 'mtmPnl',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'multiplier',
    alias: 'multiplier',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'netCash',
    alias: 'netCash',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'notes',
    alias: 'notes',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'openCloseIndicator',
    alias: 'openCloseIndicator',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'openDateTime',
    alias: 'openDateTime',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'orderReference',
    alias: 'orderReference',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'orderTime',
    alias: 'orderTime',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'orderType',
    alias: 'orderType',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'origOrderID',
    alias: 'origOrderID',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'principalAdjustFactor',
    alias: 'principalAdjustFactor',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'proceeds',
    alias: 'proceeds',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'putCall',
    alias: 'putCall',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'quantity',
    alias: 'quantity',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'reportDate',
    alias: 'reportDate',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'securityID',
    alias: 'securityID',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'settleDateTarget',
    alias: 'settleDateTarget',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'strike',
    alias: 'strike',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'symbol',
    alias: 'symbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'taxes',
    alias: 'taxes',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'tradeDate',
    alias: 'tradeDate',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'tradeID',
    alias: 'tradeID',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'tradeMoney',
    alias: 'tradeMoney',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'tradePrice',
    alias: 'tradePrice',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'tradeTime',
    alias: 'tradeTime',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'transactionID',
    alias: 'transactionID',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'transactionType',
    alias: 'transactionType',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlyingConid',
    alias: 'underlyingConid',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'underlyingListingExchange',
    alias: 'underlyingListingExchange',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlyingSecurityID',
    alias: 'underlyingSecurityID',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'underlyingSymbol',
    alias: 'underlyingSymbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'volatilityOrderLink',
    alias: 'volatilityOrderLink',
    dataType: tableau.dataTypeEnum.string
  }];


  var bbgEmailRCO_dm = [{
    id: 'ticker',
    alias: 'US_Symbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'name',
    alias: 'name',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'institution',
    alias: 'institution',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'action',
    alias: 'action',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'perf',
    alias: 'perf',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'PT',
    alias: 'PT',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'date_rco',
    alias: 'date_rco',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'ticker_us',
    alias: 'ticker_us',
    dataType: tableau.dataTypeEnum.string
  }];


  var bbgEmailRCO_dm = [{
    id: 'date_rco',
    alias: 'date_rco',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'ticker',
    alias: 'US_Symbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'ticker_us',
    alias: 'ticker_us',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'name',
    alias: 'name',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'institution',
    alias: 'institution',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'action',
    alias: 'action',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'perf',
    alias: 'perf',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'PT',
    alias: 'PT',
    dataType: tableau.dataTypeEnum.float
  }];



  var bbgEmailRCODigest_dm = [{
    id: 'date_rco',
    alias: 'date_rco',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'ticker',
    alias: 'US_Symbol',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'ticker_us',
    alias: 'ticker_us',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'name',
    alias: 'name',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'institution',
    alias: 'institution',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'action',
    alias: 'action',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'perf',
    alias: 'perf',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'PT',
    alias: 'PT',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'close_previous',
    alias: 'close_previous',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'open',
    alias: 'open',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'high',
    alias: 'high',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'low',
    alias: 'low',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'close',
    alias: 'close',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'px_chg',
    alias: 'px_chg',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'daily_return',
    alias: 'daily_return',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'volume',
    alias: 'volume',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'px_daily_digestion',
    alias: 'px_daily_digestion',
    dataType: tableau.dataTypeEnum.float
  }];


  var bbgPort_dm = [{
    id: 'portfolio_id',
    alias: 'portfolio_id',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'portfolio_name',
    alias: 'portfolio_name',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'portfolio_date',
    alias: 'portfolio_date',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'position_ticker',
    alias: 'position_ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'position_date',
    alias: 'position_date',
    dataType: tableau.dataTypeEnum.date
  }];


  var bookExposure_dm = [{
    id: 'position_id',
    alias: 'position_id',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'snapshot_datetime',
    alias: 'snapshot_datetime',
    dataType: tableau.dataTypeEnum.datetime
  }, {
    id: 'snapshot_date',
    alias: 'snapshot_date',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'ib_conid',
    alias: 'ib_conid',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'bbg_id',
    alias: 'bbg_id',
    dataType: tableau.dataTypeEnum.string
  }, /*{
    id: 'internal_underlyingId',
    alias: 'internal_underlyingId',
    dataType: tableau.dataTypeEnum.string
  },*/ {
    id: 'bbg_ticker',
    alias: 'bbg_ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset_multiplier',
    alias: 'asset_multiplier',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'asset_currency',
    alias: 'asset_currency',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset_gicsSector',
    alias: 'asset_gicsSector',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset_gicsIndustry',
    alias: 'asset_gicsIndustry',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'internal_underlyingTicker',
    alias: 'internal_underlyingTicker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'asset_priceClose',
    alias: 'asset_priceClose',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'asset_price',
    alias: 'asset_price',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'asset_deltaPct',
    alias: 'asset_deltaPct',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'bbg_underlyingPrice',
    alias: 'bbg_underlyingPrice',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_exposureBase',
    alias: 'position_exposureBase',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_qtyClose',
    alias: 'position_qtyClose',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_qtyCurrent',
    alias: 'position_qtyCurrent',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_ntcfIntradayLocal',
    alias: 'position_ntcfIntradayLocal',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_fxRate',
    alias: 'position_fxRate',
    dataType: tableau.dataTypeEnum.float
  }/*, {
    id: 'position_dailyPnlLocal',
    alias: 'position_dailyPnlLocal',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'position_dailyPnlBase',
    alias: 'position_dailyPnlBase',
    dataType: tableau.dataTypeEnum.float
  }*/, {
    id: 'position_tag',
    alias: 'position_tag',
    dataType: tableau.dataTypeEnum.string
  }];




  var bookvsports_dm = [{
    id: 'ticker',
    alias: 'ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'book_name',
    alias: 'book_name',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'sc_portfolio_name',
    alias: 'sc_portfolio_name',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'book_weight',
    alias: 'book_weight',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'sc_weight',
    alias: 'sc_weight',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'portfolio_date',
    alias: 'portfolio_date',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'snapshot_date',
    alias: 'snapshot_date',
    dataType: tableau.dataTypeEnum.date
  }];


  var matrixSector_dm = [{
    id: 'region',
    alias: 'region',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'sector',
    alias: 'sector',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'matrix_reco',
    alias: 'matrix_reco',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'rank',
    alias: 'rank',
    dataType: tableau.dataTypeEnum.int
  }, {
    id: 'bk_wei',
    alias: 'bk_wei',
    dataType: tableau.dataTypeEnum.float
  }, {
    id: 'data_date',
    alias: 'data_date',
    dataType: tableau.dataTypeEnum.date
  }];


  var tag_dm = [{
    id: 'source',
    alias: 'source',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'srcDate',
    alias: 'srcDate',
    dataType: tableau.dataTypeEnum.date
  }, {
    id: 'ticker',
    alias: 'ticker',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'tag',
    alias: 'tag',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'original_tag',
    alias: 'original_tag',
    dataType: tableau.dataTypeEnum.string
  }, {
    id: 'tag_priority',
    alias: 'tag_priority',
    dataType: tableau.dataTypeEnum.int
  }];




  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
    schemaCallback([
      {
        id: 'centraleFeed',
        alias: 'Centrale last run',
        columns: centralFeed_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'centraleHisto',
        alias: 'Centrale histo',
        columns: centralHisto_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'centraleStatics',
        alias: 'Centrale statics',
        columns: centralStatics_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'earningsHistory',
        alias: 'Earnings History',
        columns: earningsHistory_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'cboeFuturesVix',
        alias: 'CBOE VIX Futures History',
        columns: cboeFuturesVix_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibSymbology',
        alias: 'Bridge IB-BBG',
        columns: ibsymbology_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibNav',
        alias: 'IB NAV',
        columns: ibnav_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibPnl',
        alias: 'IB PnL',
        columns: ibPnl_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibNavSinceInception',
        alias: 'IB NAV Since Inception',
        columns: ibnav_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibPnlSinceInception',
        alias: 'IB PnL Since Inception',
        columns: ibPnl_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibPnlLast',
        alias: 'IB PnL Last',
        columns: ibPnl_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibPosition',
        alias: 'IB Open Positions',
        columns: ibPosition_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibPositionLast',
        alias: 'IB Open Positions Last',
        columns: ibPosition_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibExecution',
        alias: 'IB Executions',
        columns: ibExecution_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibExecutionLast',
        alias: 'IB Executions Last',
        columns: ibExecution_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'ibExecutionFX',
        alias: 'IB Executions Forex',
        columns: ibExecution_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'bbgEmailRCO',
        alias: 'BBG Email Rco',
        columns: bbgEmailRCO_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'bbgEmailRCODigest',
        alias: 'BBG Email Rco Digest',
        columns: bbgEmailRCODigest_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'bbgPort',
        alias: 'BBG Portfolio',
        columns: bbgPort_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'bbgPortHisto',
        alias: 'BBG Portfolio Histo',
        columns: bbgPort_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'bbgPortLast',
        alias: 'BBG Portfolio Last',
        columns: bbgPort_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'bookExposure',
        alias: 'Book Exposure',
        columns: bookExposure_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'bookExposureHisto',
        alias: 'Book Exposure Histo',
        columns: bookExposure_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'bookExposureLast',
        alias: 'Book Exposure Last',
        columns: bookExposure_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'bookVsPorts',
        alias: 'Book vs PORTS',
        columns: bookvsports_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'matrixSectors',
        alias: 'Matrix Sectors',
        columns: matrixSector_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'tag',
        alias: 'Tag',
        columns: tag_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }, {
        id: 'tagLast',
        alias: 'Tag Last',
        columns: tag_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
      }
    ]);
  };

  // Download the data
  myConnector.getData = function(table, doneCallback) {

    if (table.tableInfo.id == "centraleFeed") {
      var connectionDataObj = tableau.connectionData ? JSON.parse(tableau.connectionData) : {host: 'tableau/data/centrale'};

      $.getJSON(connectionDataObj.host, function(data) {

        tableData = data.map( function(company) {
          var company_data = {};
          for (var field in centralFeed_dm) { // loop on indexes
            company_data[ centralFeed_dm[field].id ] = centralFeed_dm[field].hasOwnProperty('src') ? company[ centralFeed_dm[field].src ] : company[ centralFeed_dm[field].id.replace(/__/g, '.') ];
          }
          return company_data;
        } )

        table.appendRows(tableData);
        doneCallback();


      });
    } else if (table.tableInfo.id == "centraleHisto") {

      $.getJSON('/tableau/data/centrale/histo', function(data) {

        tableData = data.map( function(company_date) {
          var company_date_data = {};
          for (var field in centralHisto_dm) { // loop on indexes
            company_date_data[ centralHisto_dm[field].id ] = centralHisto_dm[field].hasOwnProperty('src') ? company_date[ centralHisto_dm[field].src ] : company_date[ centralHisto_dm[field].id.replace(/__/g, '.') ];
          }
          return company_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();


      });
    } else if (table.tableInfo.id == "centraleStatics") {

      $.getJSON('/tableau/data/statics', function(data) {

        tableData = data.map( function(company) {
          var company_data = {};
          for (var field in centralStatics_dm) { // loop on indexes
            company_data[ centralStatics_dm[field].id ] = centralStatics_dm[field].hasOwnProperty('src') ? company[ centralStatics_dm[field].src ] : company[ centralStatics_dm[field].id.replace(/__/g, '.') ];
          }
          return company_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "earningsHistory") {

      $.getJSON('/tableau/data/earningshistory', function(data) {

        tableData = data.map( function(company_date) {
          var company_date_data = {};
          for (var field in earningsHistory_dm) { // loop on indexes
            company_date_data[ earningsHistory_dm[field].id ] = earningsHistory_dm[field].hasOwnProperty('src') ? company_date[ earningsHistory_dm[field].src ] : company_date[ earningsHistory_dm[field].id.replace(/__/g, '.') ];
          }
          return company_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "cboeFuturesVix") {

      $.getJSON('/tableau/data/cboefuturesvix', function(data) {

        tableData = data.map( function(future_date) {
          var future_date_data = {};
          for (var field in cboeFuturesVix_dm) { // loop on indexes
            future_date_data[ cboeFuturesVix_dm[field].id ] = cboeFuturesVix_dm[field].hasOwnProperty('src') ? future_date[ cboeFuturesVix_dm[field].src ] : future_date[ cboeFuturesVix_dm[field].id.replace(/__/g, '.') ];
          }
          return future_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibSymbology") {

      $.getJSON('/tableau/data/ibsymbology', function(data) {

        tableData = data.map( function(contract) {
          var contract_data = {};
          for (var field in ibsymbology_dm) { // loop on indexes
            contract_data[ ibsymbology_dm[field].id ] = ibsymbology_dm[field].hasOwnProperty('src') ? contract[ ibsymbology_dm[field].src ] : contract[ ibsymbology_dm[field].id.replace(/__/g, '.') ];
          }
          return contract_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibNav") {

      $.getJSON('/tableau/data/ibnav', function(data) {

        tableData = data.map( function(nav_date) {
          var nav_date_data = {};
          for (var field in ibnav_dm) { // loop on indexes
            nav_date_data[ ibnav_dm[field].id ] = ibnav_dm[field].hasOwnProperty('src') ? nav_date[ ibnav_dm[field].src ] : nav_date[ ibnav_dm[field].id.replace(/__/g, '.') ];
          }
          return nav_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibNavSinceInception") {

      $.getJSON('/tableau/data/ibnavsinceinception', function(data) {

        tableData = data.map( function(nav_date) {
          var nav_date_data = {};
          for (var field in ibnav_dm) { // loop on indexes
            nav_date_data[ ibnav_dm[field].id ] = ibnav_dm[field].hasOwnProperty('src') ? nav_date[ ibnav_dm[field].src ] : nav_date[ ibnav_dm[field].id.replace(/__/g, '.') ];
          }
          return nav_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibPnl") {

      $.getJSON('/tableau/data/ibpnl', function(data) {

        tableData = data.map( function(pnl_date) {
          var pnl_date_data = {};
          for (var field in ibPnl_dm) { // loop on indexes
            pnl_date_data[ ibPnl_dm[field].id ] = ibPnl_dm[field].hasOwnProperty('src') ? pnl_date[ ibPnl_dm[field].src ] : pnl_date[ ibPnl_dm[field].id.replace(/__/g, '.') ];
          }
          return pnl_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibPnlSinceInception") {

      $.getJSON('/tableau/data/ibpnlsinceinception', function(data) {

        tableData = data.map( function(pnl_date) {
          var pnl_date_data = {};
          for (var field in ibPnl_dm) { // loop on indexes
            pnl_date_data[ ibPnl_dm[field].id ] = ibPnl_dm[field].hasOwnProperty('src') ? pnl_date[ ibPnl_dm[field].src ] : pnl_date[ ibPnl_dm[field].id.replace(/__/g, '.') ];
          }
          return pnl_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibPnlLast") {

      $.getJSON('/tableau/data/ibpnl/last', function(data) {

        tableData = data.map( function(pnl_date) {
          var pnl_date_data = {};
          for (var field in ibPnl_dm) { // loop on indexes
            pnl_date_data[ ibPnl_dm[field].id ] = ibPnl_dm[field].hasOwnProperty('src') ? pnl_date[ ibPnl_dm[field].src ] : pnl_date[ ibPnl_dm[field].id.replace(/__/g, '.') ];
          }
          return pnl_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibPosition") {

      $.getJSON('/tableau/data/ibposition', function(data) {

        tableData = data.map( function(position_date) {
          var position_date_data = {};
          for (var field in ibPosition_dm) { // loop on indexes
            position_date_data[ ibPosition_dm[field].id ] = ibPosition_dm[field].hasOwnProperty('src') ? position_date[ ibPosition_dm[field].src ] : position_date[ ibPosition_dm[field].id.replace(/__/g, '.') ];
          }
          return position_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibPositionLast") {

      $.getJSON('/tableau/data/ibposition/last', function(data) {

        tableData = data.map( function(position_date) {
          var position_date_data = {};
          for (var field in ibPosition_dm) { // loop on indexes
            position_date_data[ ibPosition_dm[field].id ] = ibPosition_dm[field].hasOwnProperty('src') ? position_date[ ibPosition_dm[field].src ] : position_date[ ibPosition_dm[field].id.replace(/__/g, '.') ];
          }
          return position_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibExecution") {

      $.getJSON('/tableau/data/ibexecution', function(data) {

        tableData = data.map( function(execution_date) {
          var execution_date_data = {};
          for (var field in ibExecution_dm) { // loop on indexes
            execution_date_data[ ibExecution_dm[field].id ] = ibExecution_dm[field].hasOwnProperty('src') ? execution_date[ ibExecution_dm[field].src ] : execution_date[ ibExecution_dm[field].id.replace(/__/g, '.') ];
          }
          return execution_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibExecutionLast") {

      $.getJSON('/tableau/data/ibexecution/last', function(data) {

        tableData = data.map( function(execution_date) {
          var execution_date_data = {};
          for (var field in ibExecution_dm) { // loop on indexes
            execution_date_data[ ibExecution_dm[field].id ] = ibExecution_dm[field].hasOwnProperty('src') ? execution_date[ ibExecution_dm[field].src ] : execution_date[ ibExecution_dm[field].id.replace(/__/g, '.') ];
          }
          return execution_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "ibExecutionFX") {

      $.getJSON('/tableau/data/ibexecutionfx', function(data) {

        tableData = data.map( function(execution_date) {
          var execution_date_data = {};
          for (var field in ibExecution_dm) { // loop on indexes
            execution_date_data[ ibExecution_dm[field].id ] = ibExecution_dm[field].hasOwnProperty('src') ? execution_date[ ibExecution_dm[field].src ] : execution_date[ ibExecution_dm[field].id.replace(/__/g, '.') ];
          }
          return execution_date_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "bbgEmailRCO") {

      $.getJSON('/tableau/data/bbgemailrco', function(data) {

        tableData = data.map( function(rco) {
          var rco_data = {};
          for (var field in bbgEmailRCO_dm) { // loop on indexes
            rco_data[ bbgEmailRCO_dm[field].id ] = bbgEmailRCO_dm[field].hasOwnProperty('src') ? rco[ bbgEmailRCO_dm[field].src ] : rco[ bbgEmailRCO_dm[field].id.replace(/__/g, '.') ];
          }
          return rco_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "bbgEmailRCODigest") {

      $.getJSON('/tableau/data/bbgemailrcodigest', function(data) {

        tableData = data.map( function(rco) {
          var rco_data = {};
          for (var field in bbgEmailRCODigest_dm) { // loop on indexes
            rco_data[ bbgEmailRCODigest_dm[field].id ] = bbgEmailRCODigest_dm[field].hasOwnProperty('src') ? rco[ bbgEmailRCODigest_dm[field].src ] : rco[ bbgEmailRCODigest_dm[field].id.replace(/__/g, '.') ];
          }
          return rco_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "bbgPort") {

      $.getJSON('/tableau/data/scport', function(data) {

        tableData = data.map( function(port_position) {
          var port_position_data = {};
          for (var field in bbgPort_dm) { // loop on indexes
            port_position_data[ bbgPort_dm[field].id ] = bbgPort_dm[field].hasOwnProperty('src') ? port_position[ bbgPort_dm[field].src ] : port_position[ bbgPort_dm[field].id.replace(/__/g, '.') ];
          }
          return port_position_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "bbgPortHisto") {

      $.getJSON('/tableau/data/scport/histo', function(data) {

        tableData = data.map( function(port_position) {
          var port_position_data = {};
          for (var field in bbgPort_dm) { // loop on indexes
            port_position_data[ bbgPort_dm[field].id ] = bbgPort_dm[field].hasOwnProperty('src') ? port_position[ bbgPort_dm[field].src ] : port_position[ bbgPort_dm[field].id.replace(/__/g, '.') ];
          }
          return port_position_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "bbgPortLast") {

      $.getJSON('/tableau/data/scport/last', function(data) {

        tableData = data.map( function(port_position) {
          var port_position_data = {};
          for (var field in bbgPort_dm) { // loop on indexes
            port_position_data[ bbgPort_dm[field].id ] = bbgPort_dm[field].hasOwnProperty('src') ? port_position[ bbgPort_dm[field].src ] : port_position[ bbgPort_dm[field].id.replace(/__/g, '.') ];
          }
          return port_position_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "bookExposure") {

      $.getJSON('/tableau/data/bookexposure', function(data) {

        tableData = data.map( function(book_position) {
          var book_position_data = {};
          for (var field in bookExposure_dm) { // loop on indexes
            book_position_data[ bookExposure_dm[field].id ] = bookExposure_dm[field].hasOwnProperty('src') ? book_position[ bookExposure_dm[field].src ] : book_position[ bookExposure_dm[field].id.replace(/__/g, '.') ];
          }
          return book_position_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "bookExposureHisto") {

      $.getJSON('/tableau/data/bookexposure/histo', function(data) {

        tableData = data.map( function(book_position) {
          var book_position_data = {};
          for (var field in bookExposure_dm) { // loop on indexes
            book_position_data[ bookExposure_dm[field].id ] = bookExposure_dm[field].hasOwnProperty('src') ? book_position[ bookExposure_dm[field].src ] : book_position[ bookExposure_dm[field].id.replace(/__/g, '.') ];
          }
          return book_position_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "bookExposureLast") {

      $.getJSON('/tableau/data/bookexposure/last', function(data) {

        tableData = data.map( function(book_position) {
          var book_position_data = {};
          for (var field in bookExposure_dm) { // loop on indexes
            book_position_data[ bookExposure_dm[field].id ] = bookExposure_dm[field].hasOwnProperty('src') ? book_position[ bookExposure_dm[field].src ] : book_position[ bookExposure_dm[field].id.replace(/__/g, '.') ];
          }
          return book_position_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "bookVsPorts") {

      $.getJSON('/tableau/data/bookvsports', function(data) {

        tableData = data.map( function(position) {
          var position_data = {};
          for (var field in bookvsports_dm) { // loop on indexes
            position_data[ bookvsports_dm[field].id ] = bookvsports_dm[field].hasOwnProperty('src') ? position[ bookvsports_dm[field].src ] : position[ bookvsports_dm[field].id.replace(/__/g, '.') ];
          }
          return position_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "matrixSectors") {

      $.getJSON('/tableau/data/matrix/sectors', function(data) {

        tableData = data.map( function(matrix_entry) {
          var sector_data = {};
          for (var field in matrixSector_dm) { // loop on indexes
            sector_data[ matrixSector_dm[field].id ] = matrixSector_dm[field].hasOwnProperty('src') ? matrix_entry[ matrixSector_dm[field].src ] : matrix_entry[ matrixSector_dm[field].id.replace(/__/g, '.') ];
          }
          return sector_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "tag") {

      $.getJSON('/tableau/data/tag', function(data) {

        tableData = data.map( function(tag_histo) {
          var tag_data = {};
          for (var field in tag_dm) { // loop on indexes
            tag_data[ tag_dm[field].id ] = tag_dm[field].hasOwnProperty('src') ? tag_histo[ tag_dm[field].src ] : tag_histo[ tag_dm[field].id.replace(/__/g, '.') ];
          }
          return tag_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    } else if (table.tableInfo.id == "tagLast") {

      $.getJSON('/tableau/data/tag/last', function(data) {

        tableData = data.map( function(tag_histo) {
          var tag_data = {};
          for (var field in tag_dm) { // loop on indexes
            tag_data[ tag_dm[field].id ] = tag_dm[field].hasOwnProperty('src') ? tag_histo[ tag_dm[field].src ] : tag_histo[ tag_dm[field].id.replace(/__/g, '.') ];
          }
          return tag_data;
        } )

        table.appendRows(tableData);
        doneCallback();

      });
    }

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
