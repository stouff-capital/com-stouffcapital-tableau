# Official doc
http://tableau.github.io/webdataconnector/docs/

## kubernetes

**dependency with timescaledb** and **ib-backend** auth xls data
1. `kubectl create namespace tableau`
1. `kubectl -n tableau create secret generic tableau --from-literal=github-client-id=<clientId> --from-literal=github-client-secret=<clientSecret> --from-literal=app-secret=<appSecret>`
1. `kubectl -n tableau create secret generic ib --from-literal=backend-user=<clientId> --from-literal=backend-password=<clientSecret>`
1. `kubectl -n tableau create secret generic s3 --from-literal=s3-accesskey=<accessKey> --from-literal=s3-secretkey=<secretKey>`
1. `kubectl create -f kubernetes/com-stouffcapital-tableau-pvc.yaml`
1. `kubectl create -f kubernetes/com-stouffcapital-tableau.yaml`
1. `kubectl create -f kubernetes/com-stouffcapital-tableau-ing-ssl.yaml`


### rolling-upgrades
` kubectl -n tableau set image deployment/com-stouffcapital-tableau com-stouffcapital-tableau=stouffcapital/com-stouffcapital-tableau:<tag>`


## hive data model
```
create table tableau(`ticker__given` STRING, `data__datetime` DATE, `ticker__ultimate_ticker` STRING, `asset__NAME` STRING, `asset__ID_ISIN` STRING, `asset__CRNCY` STRING, `raw__sources__bbg__data__CRNCY` STRING, `raw__sources__bbg__data__EQY_FUND_CRNCY` STRING, `derived__data__capiBaseCrncy__baseValueInBln` DOUBLE, `asset__GICS_SECTOR_NAME` STRING, `asset__GICS_INDUSTRY_GROUP_NAME` STRING, `asset__GICS_INDUSTRY_NAME` STRING, `asset__COUNTRY_ISO__ISOALPHA2Code` STRING, `asset__region__MatrixRegion` STRING, `raw__sources__bbg__data__VOLATILITY_90D` DOUBLE, `raw__sources__bbg__data__CHG_PCT_1YR` DOUBLE, `raw__sources__bbg__data__REL_1M` DOUBLE, `raw__sources__bbg__data__REL_3M` DOUBLE, `models__GROWTH__scoring__final_score` TINYINT, `models__EPS__scoring__final_score` TINYINT, `models__MF__scoring__final_score` TINYINT, `models__RSST__scoring__final_score` TINYINT, `models__LOWVOL__scoring__final_score` TINYINT, `models__RV__scoring__final_score` TINYINT, `models__EQ__scoring__final_score` TINYINT, `models__SALES__scoring__final_score` TINYINT, `models__SMARTSENT__scoring__final_score` TINYINT, `models__GROWTH__scoring__chg__1m` TINYINT) ROW FORMAT delimited fields terminated by ',' lines terminated by "\n" LOCATION 's3a://tableau/histo/' tblproperties ("skip__header__line__count"="1");
```