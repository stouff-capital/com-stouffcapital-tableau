FROM python:3
MAINTAINER Greg Chevalley "gregory.chevalley+docker@gmail.com"
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["com-stouffcapital-tableau.py"]
