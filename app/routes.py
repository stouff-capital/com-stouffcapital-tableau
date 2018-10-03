from app import app
from flask import jsonify, make_response, redirect, render_template, request, url_for
from werkzeug.utils import secure_filename

from config import Config

import os
import zipfile
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

from flask_dance.contrib.github import make_github_blueprint, github
app.secret_key = "supersekrit"
blueprint = make_github_blueprint(
    client_id=Config.GITHUB_CLIENT_ID,
    client_secret=Config.GITHUB_CLIENT_SECRET,
)
app.register_blueprint(blueprint, url_prefix="/login")



# utilities
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
@app.route('/last')
def centrale_entry():

    if os.path.isfile( UPLOAD_FOLDER + FILENAME_TABLEAU ):
        df = pd.read_csv( UPLOAD_FOLDER + FILENAME_TABLEAU, sep=";" )

        return render_template('last.html', regions=df['asset.region.MatrixRegion'].unique(), models=['growth', 'slowdown'] )
        return render_template("last.html")
    else:
        return render_template("upload.html")


@app.route('/oauth')
def centrale_last_oauth():
    if os.path.isfile( UPLOAD_FOLDER + FILENAME_TABLEAU ):
        if not github.authorized:
            print( "centrale_entry:: ask for login" )
            return redirect(url_for("github.login"))
        else:
            resp = redirect(url_for('centrale_last', token=github.token['access_token']))
            resp.set_cookie(key='accessToken', value=github.token['access_token'])
            return resp
    else:
        return render_template("upload.html")

@app.route('/last/<token>')
def centrale_last(token):
    if github.authorized:
        return render_template("oauth.html")
    else:
        resp = requests.get('https://api.github.com/user', headers={'Authorization': 'token ' + token})
        print( resp.content )

        dict_resp = json.loads(resp.content)
        if 'message' not in dict_resp and 'login' in dict_resp:

            #resp = requests.get('https://api.github.com/orgs/stouff-capital/members' , headers={'Authorization': 'token ' + token})
            #list_members = json.loads( resp.content )

            # check memberships /orgs/:org/members/:username
            resp = requests.get('https://api.github.com/orgs/stouff-capital/members/' + dict_resp['login'] , headers={'Authorization': 'token ' + token})

            if resp.status_code == 204:
                return render_template("oauth.html")
            else:
                return redirect(url_for("github.login"))
        else:
            return redirect(url_for("github.login"))


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
            file.save( os.path.join(UPLOAD_FOLDER, FILENAME_TABLEAU) )
            app.logger.info('save as: ' + FILENAME_TABLEAU )

            df = pd.read_csv( os.path.join(UPLOAD_FOLDER, FILENAME_TABLEAU), sep=";")
            app.logger.info(f'len file: {len(df)}')

            try:
                data_datetime = df['_index'].values[0].replace("central-", "")
                #tableau_zip = zipfile.ZipFile( os.path.join(UPLOAD_FOLDER, f'tableau-{datetime.datetime.now().isoformat()[:10].replace("-", ".")}.zip'), 'w')
                tableau_zip = zipfile.ZipFile( os.path.join(UPLOAD_FOLDER, f'tableau-{data_datetime}.zip'), 'w')
                tableau_zip.write( os.path.join(UPLOAD_FOLDER, FILENAME_TABLEAU), compress_type=zipfile.ZIP_DEFLATED)
                tableau_zip.close()
                app.logger.info(f'save as: tableau-{data_datetime}.zip' )
            except:
                pass

            return render_template("last.html")

        else:
            app.logger.warning('wrong extension')
            return render_template('upload.html')

@app.route('/sc', methods=['GET'])
def sc_frontend():
    df = pd.read_csv( UPLOAD_FOLDER + FILENAME_TABLEAU, sep=";" )

    return render_template('sc.html', regions=df['asset.region.MatrixRegion'].unique(), models=['growth', 'slowdown'] )


@app.route('/tableau/data/sc/region/<string:region>/model/<string:model>', methods=['GET'])
def sc_region_model(region, model):
    df = pd.read_csv( UPLOAD_FOLDER + FILENAME_TABLEAU, sep=";" )

    if model == 'growth':
        df = sc(df, region, [['models.GROWTH.scoring.final_score', 0.3],
         ['models.GROWTH.scoring.chg.1m', 0.1],
         ['models.RV.scoring.final_score', 0.1],
         ['raw.sources.bbg.data.REL_1M adj', 0.15],
         ['models.GROWTH.components.CURRENT_EPSMthChg.intermediary_score', 0.05], ['models.GROWTH.components.CURRENT_BEstEPS4WeekChangeNextYear.intermediary_score', 0.05], ['models.GROWTH.components.CURRENT_BEstEPS4WeekChangeCurrentYear.intermediary_score', 0.05], ['models.GROWTH.components.NEXT_EPSGrowth.intermediary_score', 0.0], ['models.GROWTH.components.CURRENT_RatioEPSCurrentYearLastEPS.intermediary_score', 0.0], ['models.GROWTH.components.CURRENT_RatioEPSNextYrCurrentYr.intermediary_score', 0.05]
        ], [ ['raw.sources.bbg.data.VOLATILITY_90D', 0.15] ] )
    elif model == 'slowdown':
        df = sc(df, region, [['models.GROWTH.scoring.final_score', 0.5],
         ['models.EQ.scoring.final_score', 0.2]
        ], [ ['raw.sources.bbg.data.VOLATILITY_90D', 0.3] ])
    elif model == 'lowvol':
        pass

    #patch missing values
    df = df.where((pd.notnull(df)), None)
    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )


def sc(df, region, h_asc, h_desc, TARGET_SECTOR = 10, limitCapi = 4):
    df = df[ df['asset.region.MatrixRegion'] == region ]

    df = df[ df['derived.data.capiBaseCrncy.baseValueInBln'] > limitCapi ]

    TARGET_COMPANY = len(df['asset.GICS_SECTOR_NAME'].unique()) * TARGET_SECTOR

    df = df[ df['models.GROWTH.scoring.final_score']>=  0.9 * 55]

    try:
        df['raw.sources.bbg.data.REL_1M adj'] = -((df['raw.sources.bbg.data.REL_1M']-2)**2)
    except:
        df['raw.sources.bbg.data.REL_1M adj'] = 0

    for h in h_asc:
        try:
            df['Rank_' + h[0] ] = df[ h[0] ].rank(ascending=1)
        except:
            df['Rank_' + h[0] ] = 0

    for h in h_desc:
        try:
            df['Rank_' + h[0] ] = df[ h[0] ].rank(ascending=0)
        except:
            df['Rank_' + h[0] ] = 0

    df['Score'] = 0.0
    for h in h_asc + h_desc:
        df['Score'] = df['Score'] +  h[1] * df['Rank_' + h[0] ]

    dict_alloc = {}
    for s in df['asset.GICS_SECTOR_NAME'].unique():
        dict_alloc[s] = []

    for c in df.sort_values('Score', ascending=False).to_dict(orient='record'):
        if len( dict_alloc[ c['asset.GICS_SECTOR_NAME'] ] )>= TARGET_SECTOR:
            pass
        else:
            dict_alloc[ c['asset.GICS_SECTOR_NAME'] ].append( c )

    alloc = []
    for s in dict_alloc:
        for c in dict_alloc[s]:
            alloc.append(c)
    df_final = pd.DataFrame( alloc )

    return df[ df['ticker.given'].isin( df_final['ticker.given'] ) ]


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
