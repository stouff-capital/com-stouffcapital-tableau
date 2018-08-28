# Official doc
http://tableau.github.io/webdataconnector/docs/

## kubernetes

**dependency with timescaledb** and **ib-backend** auth xls data
`kubectl create secret generic tableau --from-literal=github-client-id=<clientId> --from-literal=github-client-secret=<clientSecret>`

`kubectl run com-stouffcapital-tableau --image=gchevalley/com-stouffcapital-tableau --port=5000`

`kubectl expose deployment com-stouffcapital-tableau --type=NodePort`
