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
