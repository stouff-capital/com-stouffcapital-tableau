from app import app
from flask import jsonify, render_template, request, url_for
from werkzeug.utils import secure_filename

import os

import pandas as pd

ALLOWED_EXTENSIONS = set(['csv'])
UPLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__)) + '/static/data/'
FILENAME = 'tableau.csv'

# utilities
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/')
@app.route('/index')
def index():
    if os.path.isfile( UPLOAD_FOLDER + FILENAME ):
        return render_template("base.html")
    else:
        return render_template("upload.html")


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

            return render_template("base.html")

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
