from app import app
from flask import jsonify, render_template, request, url_for
from werkzeug.utils import secure_filename

from config import Config

import os

import pandas as pd

ALLOWED_EXTENSIONS = set(['csv'])
UPLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__)) + '/static/data/'
FILENAME = 'tableau.csv'

# utilities
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
@app.route('/last')
def centrale_last():
    if os.path.isfile( UPLOAD_FOLDER + FILENAME ):
        return render_template("last.html")
    else:
        return render_template("upload.html")


@app.route('/histo')
def centrale_histo():
    return render_template("histo.html")


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'GET':
        return render_template('upload.html')
    elif request.method == 'POST':
        if 'file' not in request.files:
            app.logger.warning('missing file')
            return render_template('upload.html')

        file = request.files['file']
        if file.filename == '':
            app.logger.warning('file is empty')
            return render_template('upload.html')

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save( os.path.join(UPLOAD_FOLDER, FILENAME ))
            app.logger.info('save as: ' + FILENAME )

            return render_template("last.html")

        else:
            app.logger.warning('wrong extension')
            return render_template('upload.html')


@app.route('/tableau/data/centrale')
def tableau_data_centrale():

    df = pd.read_csv( UPLOAD_FOLDER + FILENAME, sep=";" )

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )


@app.route('/tableau/data/centrale/histo')
def tableau_data_centrale_histo():

    from sqlalchemy import create_engine
    engine = create_engine('postgresql://postgres:' + Config.POSTGRES_PASSWORD + '@' +  Config.POSTGRES_HOST + ':' + Config.POSTGRES_PORT + '/centralhisto')

    # df = pd.read_sql_query("SELECT time_bucket('30 days', dateeval) as one_month, avg(rank) FROM ranks WHERE ticker='AAPL US EQUITY' GROUP BY one_month;", con=engine)
    df = pd.read_sql_query("SELECT * FROM ranks WHERE dateeval>='2017-01-01' ORDER BY dateeval DESC, Ticker ASC;", con=engine)

    # transforme datetime.date into str
    df['dateeval'] = pd.to_datetime(df['dateeval']).dt.strftime('%Y-%m-%d')

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )
