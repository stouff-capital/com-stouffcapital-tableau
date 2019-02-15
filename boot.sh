#!/bin/sh
exec gunicorn -b :5000 --access-logfile - --error-logfile - --timeout 120 com-stouffcapital-tableau:app
