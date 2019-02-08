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




  // Define the schema
  myConnector.getSchema = function(schemaCallback) {
    schemaCallback([
      {
        id: 'centraleFeed',
        alias: 'Centrale last run',
        columns: centralFeed_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
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
        id: 'ibPosition',
        alias: 'IB Open Positions',
        columns: ibPosition_dm.map( function(field) { return {id: field.id, alias: field.alias, dataType: field.dataType } } )
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
