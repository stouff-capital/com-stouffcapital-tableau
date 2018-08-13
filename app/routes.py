from app import app
from flask import jsonify, render_template, request, url_for
from werkzeug.utils import secure_filename

from config import Config

import os
import json
import datetime

import pandas as pd

import requests
from requests.auth import HTTPBasicAuth

AUTH=HTTPBasicAuth(Config.BASIC_AUTH_USERNAME, Config.BASIC_AUTH_PASSWORD )

ALLOWED_EXTENSIONS = set(['csv', 'json'])
UPLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__)) + '/static/data/'
FILENAME_TABLEAU = 'tableau.csv'
FILENAME_XLS = 'xls.json'


from flask_basicauth import BasicAuth
app.config['BASIC_AUTH_USERNAME'] = Config.BASIC_AUTH_USERNAME
app.config['BASIC_AUTH_PASSWORD'] = Config.BASIC_AUTH_PASSWORD
basic_auth = BasicAuth(app)

# utilities
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
@app.route('/last')
def centrale_last():
    if os.path.isfile( UPLOAD_FOLDER + FILENAME_TABLEAU ):
        return render_template("last.html")
    else:
        return render_template("upload.html")


@app.route('/ib/eod/transactions')
def ib_eod_transactions():
    if os.path.isfile( UPLOAD_FOLDER + FILENAME_TABLEAU ):
        return render_template("ib_eod_transactions.html")
    else:
        return render_template("upload.html")


@app.route('/ib/eod/positions')
def ib_eod_positions():
    if os.path.isfile( UPLOAD_FOLDER + FILENAME_TABLEAU ):
        return render_template("ib_eod_positions.html")
    else:
        return render_template("upload.html")


@app.route('/xls/positions')
def xls_positions():
    if os.path.isfile( UPLOAD_FOLDER + FILENAME_XLS ):
        return render_template("xls_positions.html")
    else:
        return jsonfiy({'status': 'error', 'error': 'data missing'})


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
            file.save( os.path.join(UPLOAD_FOLDER, FILENAME_TABLEAU ))
            app.logger.info('save as: ' + FILENAME_TABLEAU )

            return render_template("last.html")

        else:
            app.logger.warning('wrong extension')
            return render_template('upload.html')


@app.route('/tableau/data/centrale')
def tableau_data_centrale():

    df = pd.read_csv( UPLOAD_FOLDER + FILENAME_TABLEAU, sep=";" )

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )


@app.route('/tableau/data/xls/upload', methods=['POST'])
@basic_auth.required
def tableau_data_xls_uppload():
    df = pd.DataFrame( request.get_json() )

    df.to_json( path_or_buf=UPLOAD_FOLDER + FILENAME_XLS, orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'positions': len( df ),
        'output': df.to_dict(orient='records')
    } )



@app.route('/tableau/data/ib/eod/transactions')
@basic_auth.required
def tableau_data_ib_transactions():

    res = requests.get(Config.IB_HOST + '/reports/ib/eod/transactions', auth=AUTH)
    df = pd.read_json(res.content, orient='records' )

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )


@app.route('/tableau/data/ib/eod/positions')
@basic_auth.required
def tableau_data_ib_positions():

    res = requests.get(Config.IB_HOST + '/reports/ib/eod/positions', auth=AUTH)
    df = pd.read_json(res.content, orient='records' )

    list_positions = df.to_dict(orient='records')
    df_xls = pd.read_json( UPLOAD_FOLDER + FILENAME_XLS, orient='records' )

    # option premiums -> delta expositions
    for openPosition in list_positions:
        openPosition['position_exposureNetBase'] = openPosition['valeurBase']
        if openPosition["Catégorie d\'actifs"][:6] == 'Option':
            mask = df_xls[ df_xls['position_id'] == 'U1160693_IB_' + openPosition['Identifier'] ]
            if len(mask) > 0:
                     openPosition['position_exposureNetBase'] = mask['position_exposureNetBase'].values[0]
            else:
                print(f'U1160693_IB_{openPosition["Identifier"]} not found in df xls')

    df = pd.DataFrame( list_positions )


    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )


@app.route('/tableau/data/xls/positions')
@basic_auth.required
def tableau_data_xls_positions():

    df = pd.read_json(UPLOAD_FOLDER + FILENAME_XLS, orient='records' )

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
