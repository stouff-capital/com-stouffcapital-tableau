# Official doc
http://tableau.github.io/webdataconnector/docs/

## kubernetes

**dependency with timescaledb** and **ib-backend** auth xls data
1. `kubectl create namespace tableau`
1. `kubectl -n tableau create secret generic tableau --from-literal=github-client-id=<clientId> --from-literal=github-client-secret=<clientSecret>`
1. `kubectl create -f kubernetes/com-stouffcapital-tableau-pvc.yaml`
1. `kubectl create -f kubernetes/com-stouffcapital-tableau.yaml`
1. `kubectl create -f kubernetes/com-stouffcapital-tableau-ing-ssl.yaml`
