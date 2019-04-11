from app import app
from flask import current_app, jsonify, make_response, redirect, render_template, request, url_for
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
UPLOAD_FOLDER = f'{os.path.dirname(os.path.abspath(__file__))}/static/data/'
FILENAME_TABLEAU = 'tableau.csv'
FILENAME_CENTRALE_HISTO_ZIP = 'centrale_histo.zip'
FILENAME_CENTRALE_HISTO = 'centrale_histo.json'
FILENAME_XLS = 'xls.json'
FILENAME_SURP = 'surp.json'
FILENAME_EARNINGS_HISTORY = 'earningsHistory.json'
FILENAME_VIX_FUTURE_HISTORY = 'cboeFuturesVix.json'
FILENAME_IB_SYMBOLOGY = 'ibsymbology.json'
FILENAME_IB_PNL = 'ib_pnl.json'
FILENAME_IB_NAV = 'ib_nav.json'
FILENAME_IB_PNL_SINCEINCEPTION = 'ib_pnl_sinceinception.json'
FILENAME_IB_NAV_SINCEINCEPTION = 'ib_nav_sinceinception.json'
FILENAME_IB_POSITION = 'ib_position.json'
FILENAME_IB_EXECUTION = 'ib_execution.json'
FILENAME_IB_EXECUTION_FX = 'ib_execution_fx.json'
FILENAME_BBG_EMAIL_RCO = 'bbg_email_rco.json'
FILENAME_BBG_EMAIL_RCO_DIGEST = 'bbg_email_rco_digest.json'
FILENAME_BBG_SC_PORTS = 'bbg_sc_ports.json'
FILENAME_BOOK_EXPOSURE = 'book_exposure.json'

MODELS = ['growth', 'lowvol', 'u2', 'slowdown', 'sales']


from flask_basicauth import BasicAuth
app.config['BASIC_AUTH_USERNAME'] = Config.BASIC_AUTH_USERNAME
app.config['BASIC_AUTH_PASSWORD'] = Config.BASIC_AUTH_PASSWORD
basic_auth = BasicAuth(app)

from flask_dance.contrib.github import make_github_blueprint, github
app.secret_key = Config.APP_SECRET
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

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}' ):
        df = pd.read_csv( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}', sep=";" )

        return render_template('last.html', regions=df['asset.region.MatrixRegion'].unique(), models=MODELS )
    else:
        return render_template("upload.html")


@app.route('/oauth')
def centrale_last_oauth():
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}' ):
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
        resp = requests.get('https://api.github.com/user', headers={'Authorization': f'token {token}'})
        print( resp.content )

        dict_resp = json.loads(resp.content)
        if 'message' not in dict_resp and 'login' in dict_resp:

            #resp = requests.get('https://api.github.com/orgs/stouff-capital/members' , headers={'Authorization': f'token {token}'})
            #list_members = json.loads( resp.content )

            # check memberships /orgs/:org/members/:username
            resp = requests.get(f'https://api.github.com/orgs/stouff-capital/members/{dict_resp["login"]}' , headers={'Authorization': f'token {token}'})

            if resp.status_code == 204:
                return render_template("oauth.html")
            else:
                return redirect(url_for("github.login"))
        else:
            return redirect(url_for("github.login"))


@app.route('/ib/eod/transactions')
def ib_eod_transactions():
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}' ):
        return render_template("ib_eod_transactions.html")
    else:
        return render_template("upload.html")


@app.route('/ib/eod/positions')
def ib_eod_positions():
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}' ):
        return render_template("ib_eod_positions.html")
    else:
        return render_template("upload.html")


@app.route('/xls/positions')
def xls_positions():
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_XLS}' ):
        return render_template("xls_positions.html")
    else:
        current_app.logger.warning(f'missing file: {FILENAME_XLS}')
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
            app.logger.info(f'save as: {FILENAME_TABLEAU}' )

            df = pd.read_csv( os.path.join(UPLOAD_FOLDER, FILENAME_TABLEAU), sep=";")
            app.logger.info(f'len file: {len(df)}')

            try:
                data_datetime = df['_index'].values[0].replace("central-", "")
                tableau_zip = zipfile.ZipFile( os.path.join(UPLOAD_FOLDER, f'tableau-{data_datetime}.zip'), 'w')
                tableau_zip.write( os.path.join(UPLOAD_FOLDER, FILENAME_TABLEAU), compress_type=zipfile.ZIP_DEFLATED)
                tableau_zip.close()
                app.logger.info(f'save as: tableau-{data_datetime}.zip' )
            except:
                pass

            return centrale_entry()

        else:
            app.logger.warning('wrong extension')
            return render_template('upload.html')


@app.route('/sc', methods=['GET'])
def sc_frontend():
    df = pd.read_csv( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}', sep=";" )

    return render_template('sc.html', regions=df['asset.region.MatrixRegion'].unique(), models=MODELS )


@app.route('/tableau/data/sc/region/<string:region>/model/<string:model>', methods=['GET'])
def sc_region_model(region, model):
    #df = pd.read_csv( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}', sep=";" )
    df = prepare_dataset()

    if model == 'growth':
        df = sc(df, region, [
            ['models.GROWTH.scoring.final_score', 0.3],
            ['models.GROWTH.scoring.chg.1m', 0.1],
            ['models.RV.scoring.final_score', 0.1],
            ['raw.sources.bbg.data.REL_1M adj', 0.15],
            ['models.GROWTH.components.CURRENT_EPSMthChg.intermediary_score', 0.05], ['models.GROWTH.components.CURRENT_BEstEPS4WeekChangeNextYear.intermediary_score', 0.05], ['models.GROWTH.components.CURRENT_BEstEPS4WeekChangeCurrentYear.intermediary_score', 0.05], ['models.GROWTH.components.NEXT_EPSGrowth.intermediary_score', 0.0], ['models.GROWTH.components.CURRENT_RatioEPSCurrentYearLastEPS.intermediary_score', 0.0], ['models.GROWTH.components.CURRENT_RatioEPSNextYrCurrentYr.intermediary_score', 0.05]
        ], [
            ['raw.sources.bbg.data.VOLATILITY_90D', 0.15]
        ] )
    elif model == 'slowdown':
        df = sc(df, region, [
            ['models.GROWTH.scoring.final_score', 0.5],
            ['models.EQ.scoring.final_score', 0.2]
        ], [
            ['raw.sources.bbg.data.VOLATILITY_90D', 0.3]
        ])
    elif model == 'u2':
        df = sc(df, region, [
            ['models.GROWTH.scoring.final_score', 0.25],
            ['models.RV.scoring.final_scor', 0.4],
            ['models.RSST.scoring.final_score', 0.12]
        ], [
            ['raw.sources.bbg.data.REL_3M', 0.23]
        ])
    elif model == 'lowvol':
        df = sc(df, region, [
            ['models.GROWTH.scoring.final_score', 0.5]
        ], [
            ['raw.sources.bbg.data.VOLATILITY_90D', 0.5]
        ])
    elif model == 'sales':
        df = sc(df, region, [
            ['models.GROWTH.scoring.final_score', 0.20],
            ['models.SALES.scoring.final_score', 0.15],
            ['models.RSST.scoring.final_score', 0.0],
            ['models.RV.scoring.final_score', 0.05],
            ['models.EQ.scoring.final_score', 0.05],
            ['models.SMARTSENT.scoring.final_score', 0.10],
            ['models.MF.scoring.final_score', 0.10],
        ], [
            ['raw.sources.bbg.data.VOLATILITY_30D', 0.175],
            ['raw.sources.bbg.data.VOLATILITY_90D', 0.175]
        ])

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
            df[f'Rank_{h[0]}' ] = df[ h[0] ].rank(ascending=1)
        except:
            df[f'Rank_{h[0]}' ] = 0

    for h in h_desc:
        try:
            df[f'Rank_{h[0]}' ] = df[ h[0] ].rank(ascending=0)
        except:
            df[f'Rank_{h[0]}' ] = 0

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


def prepare_dataset():
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}' ):
        df = pd.read_csv( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}', sep=";" )

        # merge with other available datasets
        if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_SURP}' ):
            df_surp = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_SURP}', orient="records" )
            df = df.merge(right=df_surp, how='left', left_on='ticker.given', right_on='ticker')


        # add metadata
        df["data.datestamp"] = df["_index"].str.replace("central-", "").str.replace(".", "-")
    else:
        df = pd.DataFrame([])

    return df



@app.route('/tableau/data/centrale')
def tableau_data_centrale():
    #df = pd.read_csv( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}', sep=";" )
    df = prepare_dataset()

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )


@app.route('/tableau/data/centrale/histo/upload', methods=['POST'])
@basic_auth.required
def tableau_data_centrale_histo_upload():
    if 'file' not in request.files:
        app.logger.warning('missing file')
        return jsonify( {
            'status': 'error',
            'submittedDatetime': datetime.datetime.now().isoformat(),
            'error': 'missing file',
        } )

    file = request.files['file']
    if file.filename.split(".")[-1] == 'zip':
        file.save( f'{UPLOAD_FOLDER}{FILENAME_CENTRALE_HISTO_ZIP}' )
        import zipfile
        with zipfile.ZipFile( f'{UPLOAD_FOLDER}{FILENAME_CENTRALE_HISTO_ZIP}', "r") as zip_ref:
            zip_ref.extractall( f'{UPLOAD_FOLDER}' )
    elif file.filename.split(".")[-1] == 'json':
        file.save( f'{UPLOAD_FOLDER}{FILENAME_CENTRALE_HISTO}' )

    #df = pd.read_json(f'{UPLOAD_FOLDER}{FILENAME_CENTRALE_HISTO}', orient='records')

    return jsonify( {
        'status': 'ok',
        'uploadFile': file.filename,
        'submittedDatetime': datetime.datetime.now().isoformat(),
#        'data': len(df),
    } )


@app.route('/tableau/data/centrale/histo', methods=['GET'])
def tableau_data_centrale_histo():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_CENTRALE_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_CENTRALE_HISTO}', orient="records" )

        df = df.rename(columns={'run.date': 'data.datestamp'})
    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )



def ibsymbology_manual():
    return [
    {
        'ticker.given': 'BTC1 CURNCY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'BITCOIN',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'COMMODITY'
    }, {
        'ticker.given': 'CL1 COMDTY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'CRUDE OIL',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'COMMODITY'
    }, {
        'ticker.given': 'HG1 COMDTY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'COPPER',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'COMMODITY'
    }, {
        'ticker.given': 'RX1 COMDTY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'EURO BUND',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'BOND'
    }, {
        'ticker.given': 'TY1 COMDTY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'US TREASURY',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'BOND'
    }, {
        'ticker.given': 'CAC INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'CAC 40 INDEX',
        'asset.CRNCY': 'EUR',
        'asset.region.MatrixRegion': 'Europe',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'DAX INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'DAX INDEX',
        'asset.CRNCY': 'EUR',
        'asset.region.MatrixRegion': 'Europe',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'HSCEI INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'HANG SENG CHINA ENT INDX',
        'asset.CRNCY': 'HKD',
        'asset.region.MatrixRegion': 'Emerging',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'NDX INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'NASDAQ 100 STOCK INDX',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'NKY INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'NIKKEI 225',
        'asset.CRNCY': 'JPY',
        'asset.region.MatrixRegion': 'Japan',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'RTY INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'RUSSEL 2000 INDEX',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'SMI INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'SWISS MARKET INDEX',
        'asset.CRNCY': 'CHF',
        'asset.region.MatrixRegion': 'Europe',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'SPX INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'S&P 500 INDEX',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'SX5E INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'Euro Stoxx 50 Pr',
        'asset.CRNCY': 'EUR',
        'asset.region.MatrixRegion': 'Europe',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'SX5ED INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'EURO STOXX 50 DVP VP',
        'asset.CRNCY': 'EUR',
        'asset.region.MatrixRegion': 'Europe',
        'exposureType': 'DIVIDEND'
    }, {
        'ticker.given': 'VIX INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'CBOE SPX VOLATILITY INDX',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'VOLATILITY'
    }, {
        'ticker.given': 'EEM US EQUITY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'ISHARES MSCI EMERGING MARKET',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'Emerging',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'EIDO US EQUITY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'ISHARES MSCI INDONESIA ETF',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'Emerging',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'EWW US EQUITY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'ISHARES MSCI MEXICO ETF',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'Emerging',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'FXI US EQUITY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'ISHARES CHINA LARGE-CAP ETF',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'Emerging',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'INDA US EQUITY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'ISHARES MSCI INDIA ETF',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'Emerging',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'TUR US EQUITY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'ISHARES MSCI TURKEY ETF',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'Emerging',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'GDX US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Materials',
        'asset.NAME': 'VANECK VECTORS GOLD MINERS ETF',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'SMH US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Information Technology',
        'asset.NAME': 'VANECK VECTORS SEMICONDUCTOR',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'IBB US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Health Care',
        'asset.NAME': 'ISHARES NASDAQ BIOTECHNOLOGY',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'XHB US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Consumer Discretionary',
        'asset.NAME': 'SPDR S&P HOMEBUILDERS ETF',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'XLB US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Materials',
        'asset.NAME': 'MATERIALS SELECT SECTOR SPDR',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'XLE US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Energy',
        'asset.NAME': 'ENERGY SELECT SECTOR SPDR',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'XLF US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Financials',
        'asset.NAME': 'FINANCIAL SELECT SECTOR SPDR',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'XLI US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Industrials',
        'asset.NAME': 'INDUSTRIAL SELECT SECT SPDR',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'XLP US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Consumer Staples',
        'asset.NAME': 'CONSUMER STAPLES SPDR',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'XLU US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Utilities',
        'asset.NAME': 'UTILITIES SELECT SECTOR SPDR',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'XLV US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Health Care',
        'asset.NAME': 'HEALTH CARE SELECT SECTOR',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'XME US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Materials',
        'asset.NAME': 'SPDR S&P METALS & MINING ETF',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }
    ]



@app.route('/tableau/data/statics')
def tableau_data_statics():
    #df = pd.read_csv( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}', sep=";" )
    #df = prepare_dataset()

    df_manual = pd.DataFrame(
        [{
            'ticker.given': asset['ticker.given'] if 'ticker.given' in asset else None,
            'data.datestamp': datetime.datetime.now().strftime('%Y-%m-%d'),
            'asset.NAME':  asset['asset.NAME'] if 'asset.NAME' in asset else None,
#            'asset.ID_ISIN': asset['asset.ID_ISIN'] if 'asset.ID_ISIN' in asset else None,
            'asset.CRNCY':  asset['asset.CRNCY'] if 'asset.CRNCY' in asset else None,
            'asset.GICS_SECTOR_NAME':  asset['asset.GICS_SECTOR_NAME'] if 'asset.GICS_SECTOR_NAME' in asset else None,
#            'asset.GICS_INDUSTRY_GROUP_NAME':  asset['asset.GICS_INDUSTRY_GROUP_NAME'] if 'asset.GICS_INDUSTRY_GROUP_NAME' in asset else None,
#            'asset.GICS_INDUSTRY_NAME':  asset['asset.GICS_INDUSTRY_NAME'] if 'asset.GICS_INDUSTRY_NAME' in asset else None,
#            'asset.COUNTRY_ISO.ISOALPHA2Code':  asset['asset.COUNTRY_ISO.ISOALPHA2Code'] if 'asset.COUNTRY_ISO.ISOALPHA2Code' in asset else None,
#            'asset.COUNTRY_ISO.name':  asset['asset.COUNTRY_ISO.name'] if 'asset.COUNTRY_ISO.name' in asset else None,
            'asset.region.MatrixRegion':  asset['asset.region.MatrixRegion'] if 'asset.region.MatrixRegion' in asset else None,
#            'derived.data.capiLocalCrncy.localValueInBln':  asset['derived.data.capiLocalCrncy.localValueInBln'] if 'derived.data.capiLocalCrncy.localValueInBln' in asset else None,
#            'derived.data.capiLocalCrncy.baseValueInBln':  asset['derived.data.capiLocalCrncy.baseValueInBln'] if 'derived.data.capiLocalCrncy.baseValueInBln' in asset else None,
        }
         for asset
         in ibsymbology_manual()]
    )

    df = pd.concat([prepare_dataset(), df_manual], sort=False)


    # get statics from open positions not in universe
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_SYMBOLOGY}' ):
        df_symbology = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_SYMBOLOGY}', orient="records" )

        list_openPosNotInUniverse = []
        for asset in df_symbology.to_dict(orient='records'):

            if " EQUITY" in asset["underlyingBloombergTicker"]:
                asset["underlyingBloombergTicker"] = patch_ticker_marketplace(asset["underlyingBloombergTicker"])
                if asset["underlyingBloombergTicker"] not in list(df["ticker.given"].values):
                    list_openPosNotInUniverse.append(
                        {
                            'ticker.given': asset['underlyingBloombergTicker'],
                            'data.datestamp': datetime.datetime.now().strftime('%Y-%m-%d'),
                            'asset.NAME':  asset['underlyingBloombergTicker'],
                            'asset.CRNCY':  None,
                            'asset.GICS_SECTOR_NAME':  asset['GICS_SECTOR_NAME'] if asset['GICS_SECTOR_NAME'][0] != '#' else None,
                            'asset.GICS_INDUSTRY_GROUP_NAME':  asset['GICS_INDUSTRY_GROUP_NAME'] if asset['GICS_INDUSTRY_GROUP_NAME'][0] != '#' else None,
                            'asset.GICS_INDUSTRY_NAME':  asset['GICS_INDUSTRY_NAME'] if asset['GICS_INDUSTRY_NAME'][0] != '#' else None,
                            'asset.region.MatrixRegion':  asset['asset.region.MatrixRegion'] if asset['asset.region.MatrixRegion'][0] != '#' else None,
                        }
                    )

        df_openPosNotInUniverse = pd.DataFrame(list_openPosNotInUniverse)
        df = pd.concat([df, df_openPosNotInUniverse], sort=False)




    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )



@app.route('/tableau/data/xls/upload', methods=['POST'])
@basic_auth.required
def tableau_data_xls_uppload():
    df = pd.DataFrame( request.get_json() )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_XLS}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'positions': len( df ),
        'output': df.to_dict(orient='records')
    } )


@app.route('/tableau/data/surp/upload', methods=['POST'])
@basic_auth.required
def tableau_data_surp_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    # processing pct values
    for h in ['averageSurp', 'averageAbsSurp', 'averageAbsPxChg', 'implied1DayMove']:
        df[h] = df[h] / 100

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_SURP}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'companies': len(df),
    } )


@app.route('/tableau/data/earningshistory/upload', methods=['POST'])
@basic_auth.required
def tableau_data_earningsHistroy_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    # processing pct values
    for h in ['surprise']:
        df[h] = df[h] / 100

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_EARNINGS_HISTORY}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/earningshistory', methods=['GET'])
def tableau_data_earningsHistroy():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_EARNINGS_HISTORY}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_EARNINGS_HISTORY}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/cboefuturesvix/upload', methods=['POST'])
@basic_auth.required
def tableau_data_cboeFuturesVix_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_VIX_FUTURE_HISTORY}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/cboefuturesvix', methods=['GET'])
def tableau_data_cboeFuturesVix():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_VIX_FUTURE_HISTORY}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_VIX_FUTURE_HISTORY}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )



@app.route('/tableau/data/ibsymbology/upload', methods=['POST'])
@basic_auth.required
def tableau_data_ibsymbology_upload():
    df_rcv = pd.DataFrame( request.get_json()['data'] )

    count_assets = 0
    count_new = 0
    count_updates = 0
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_SYMBOLOGY}' ):
        df_current = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_SYMBOLOGY}', orient="records" )

        list_rcv = df_rcv.to_dict(orient='records')
        list_current = df_current.to_dict(orient='records')

        for asset in list_rcv:
            if asset['contract_conid'] not in list(df_current['contract_conid'].values):
                list_current.append(asset)
                count_new += 1
            else:
                for idx, c_asset in enumerate(list_current):
                    if c_asset['contract_conid'] == asset['contract_conid']:
                        # edit the list
                        list_current_idx_toEdit = idx
                        break
                for key in asset:
                    if asset[key] != None:

                        if key not in list_current[list_current_idx_toEdit]:
                            list_current[list_current_idx_toEdit][key] = asset[key]
                            count_updates += 1
                        else:
                            if list_current[list_current_idx_toEdit][key]  != asset[key]:
                                list_current[list_current_idx_toEdit][key] = asset[key]
                                count_updates += 1


        df_current = pd.DataFrame(list_current)

        df_current.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_IB_SYMBOLOGY}', orient='records' )
        count_assets = len(df_current)

    else:
        df_rcv.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_IB_SYMBOLOGY}', orient='records' )
        count_assets = len(df_rcv)
        count_new = len(df_rcv)


    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': count_assets,
        'new': count_new,
        'updates': count_updates,
    } )


def patch_ticker_marketplace(ticker):
    mps = {
        "GY": "GR",
        "JT": "JP",
        "UN": "US",
        "UQ": "US",
        "UW": "US",
        "UR": "US",
        "UF": "US",
        "SQ": "SM",
        "SE": "SW",
    }

    ticker = ticker.upper()

    for mp in mps:
        ticker = ticker.replace(f' {mp} EQUITY',  f' {mps[mp]} EQUITY')

    return ticker


@app.route('/tableau/data/ibsymbology', methods=['GET'])
def tableau_data_ibsymbology():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_SYMBOLOGY}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_SYMBOLOGY}', orient="records" )

    else:
        df = pd.DataFrame([])

    # patch manual symbology for exposureType
    dict_underlying_exposureType = {}
    list_manual_underlyings = ibsymbology_manual()

    for underlying in list_manual_underlyings:
        dict_underlying_exposureType[underlying["ticker.given"]] = underlying["exposureType"]

    list_assets = df.to_dict(orient='records')
    list_patched_asset = []

    for asset in list_assets:

        asset["underlyingBloombergTicker"] = patch_ticker_marketplace(asset["underlyingBloombergTicker"])

        if asset['underlyingBloombergTicker'] in dict_underlying_exposureType:
            asset['exposureType'] = dict_underlying_exposureType[ asset['underlyingBloombergTicker'] ]

        list_patched_asset.append(asset)

    df = pd.DataFrame(list_patched_asset)



    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/ibpnlsinceinception/upload', methods=['POST'])
@basic_auth.required
def tableau_data_ibPnlsinceinception_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_IB_PNL_SINCEINCEPTION}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/ibpnlsinceinception', methods=['GET'])
def tableau_data_ibPnlsinceinception():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_PNL_SINCEINCEPTION}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_PNL_SINCEINCEPTION}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )




@app.route('/tableau/data/ibpnl/upload', methods=['POST'])
@basic_auth.required
def tableau_data_ibPnl_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_IB_PNL}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/ibpnl', methods=['GET'])
def tableau_data_ibPnl():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_PNL}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_PNL}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/ibpnl/last', methods=['GET'])
def tableau_data_ibPnl_last():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_PNL}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_PNL}', orient="records" )

        df = df[ df.reportDate == df.reportDate.max() ]

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/ibnavsinceinception/upload', methods=['POST'])
@basic_auth.required
def tableau_data_ibnavsinceinception_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_IB_NAV_SINCEINCEPTION}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/ibnavsinceinception', methods=['GET'])
def tableau_data_ibnavsinception():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_NAV_SINCEINCEPTION}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_NAV_SINCEINCEPTION}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/ibnav/upload', methods=['POST'])
@basic_auth.required
def tableau_data_ibnav_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_IB_NAV}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/ibnav', methods=['GET'])
def tableau_data_ibnav():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_NAV}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_NAV}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/ibposition/upload', methods=['POST'])
@basic_auth.required
def tableau_data_ibposition_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_IB_POSITION}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/ibposition', methods=['GET'])
def tableau_data_ibposition():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_POSITION}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_POSITION}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/ibposition/last', methods=['GET'])
def tableau_data_ibposition_last():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_POSITION}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_POSITION}', orient="records" )

        df = df[ df.reportDate == df.reportDate.max() ]

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )



@app.route('/tableau/data/ibexecution/upload', methods=['POST'])
@basic_auth.required
def tableau_data_ibexecution_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_IB_EXECUTION}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/ibexecution', methods=['GET'])
def tableau_data_ibexecution():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_EXECUTION}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_EXECUTION}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/ibexecution/last', methods=['GET'])
def tableau_data_ibexecution_last():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_EXECUTION}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_EXECUTION}', orient="records" )

        df = df[ df.reportDate == df.reportDate.max() ]

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )




@app.route('/tableau/data/ibexecutionfx/upload', methods=['POST'])
@basic_auth.required
def tableau_data_ibexecutionfx_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_IB_EXECUTION_FX}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/ibexecutionfx', methods=['GET'])
def tableau_data_ibexecutionfx():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_IB_EXECUTION_FX}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_IB_EXECUTION_FX}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )




@app.route('/tableau/data/bbgemailrco/upload', methods=['POST'])
@basic_auth.required
def tableau_data_bbgemailrco_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_BBG_EMAIL_RCO}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/bbgemailrco', methods=['GET'])
def tableau_data_bbgemailrco():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BBG_EMAIL_RCO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BBG_EMAIL_RCO}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/bbgemailrcodigest/upload', methods=['POST'])
@basic_auth.required
def tableau_data_bbgemailrcodigest_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_BBG_EMAIL_RCO_DIGEST}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/bbgemailrcodigest', methods=['GET'])
def tableau_data_bbgemailrcodigest():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BBG_EMAIL_RCO_DIGEST}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BBG_EMAIL_RCO_DIGEST}', orient="records" )

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/scport/upload', methods=['POST'])
@basic_auth.required
def tableau_data_scport_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/scport', methods=['GET'])
def tableau_data_scport():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS}', orient="records" )

    else:
        df = pd.DataFrame([])

    # processing
    df['position_ticker'] = df['position_ticker'].apply(patch_ticker_marketplace)

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/bookexposure/upload', methods=['POST'])
@basic_auth.required
def tableau_data_bookexposure_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    # processing
    df['position_dailyPnlLocal'] = ((df['asset_price']-df['asset_priceClose'])*df['position_qtyCurrent']*df['asset_multiplier']+df['position_ntcfIntradayLocal']+(df['position_qtyCurrent']-df['position_qtyClose'])*df['asset_priceClose']*df['asset_multiplier'])
    df['position_dailyPnlBase'] = df['position_dailyPnlLocal'] * df['position_fxRate']

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/bookexposure', methods=['GET'])
def tableau_data_bookexposure():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE}', orient="records" )

    else:
        df = pd.DataFrame([])

    # processing
    df['internal_underlyingTicker'] = df['internal_underlyingTicker'].apply(patch_ticker_marketplace)

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/ib/eod/transactions')
@basic_auth.required
def tableau_data_ib_transactions():

    res = requests.get(f'{Config.IB_HOST}/reports/ib/eod/transactions', auth=AUTH)
    df = pd.read_json(res.content, orient='records' )

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )


@app.route('/tableau/data/ib/eod/positions')
@basic_auth.required
def tableau_data_ib_positions():

    res = requests.get(f'{Config.IB_HOST}/reports/ib/eod/positions', auth=AUTH)
    df = pd.read_json(res.content, orient='records' )

    list_positions = df.to_dict(orient='records')
    df_xls = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_XLS}', orient='records' )

    # option premiums -> delta expositions
    for openPosition in list_positions:
        openPosition['position_exposureNetBase'] = openPosition['valeurBase']
        if openPosition["Catégorie d\'actifs"][:6] == 'Option':
            mask = df_xls[ df_xls['position_id'] == f'U1160693_IB_{openPosition["Identifier"]}' ]
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

    df = pd.read_json(f'{UPLOAD_FOLDER}{FILENAME_XLS}', orient='records' )

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )


@app.route('/tableau/data/centrale/histo')
def tableau_data_centrale_histo_db():

    from sqlalchemy import create_engine
    engine = create_engine(f'postgresql://postgres:{Config.POSTGRES_PASSWORD}@{Config.POSTGRES_HOST}:{Config.POSTGRES_PORT}/centralhisto')

    # df = pd.read_sql_query("SELECT time_bucket('30 days', dateeval) as one_month, avg(rank) FROM ranks WHERE ticker='AAPL US EQUITY' GROUP BY one_month;", con=engine)
    df = pd.read_sql_query("SELECT * FROM ranks WHERE dateeval>='2017-01-01' ORDER BY dateeval DESC, Ticker ASC;", con=engine)

    # transforme datetime.date into str
    df['dateeval'] = pd.to_datetime(df['dateeval']).dt.strftime('%Y-%m-%d')

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )
