FROM python:3.6-slim-jessie
LABEL maintainer="gregory.chevalley+docker@gmail.com"

COPY . /app
WORKDIR /app
RUN pip install --upgrade pip && pip install -r requirements.txt

RUN chmod a+x boot.sh
ENV FLASK_APP com-stouffcapital-tableau.py

EXPOSE 5000
#ENTRYPOINT ["python"]
#CMD ["com-stouffcapital-tableau.py"]
ENTRYPOINT ["./boot.sh"]
