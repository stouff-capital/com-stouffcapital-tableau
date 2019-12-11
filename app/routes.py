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
FILENAME_BBG_SC_PORTS_HISTO = 'bbg_sc_ports_histo.json'
FILENAME_BOOK_EXPOSURE = 'book_exposure.json'
FILENAME_BOOK_EXPOSURE_HISTO = 'book_exposure_histo.json'
FILENAME_BOOK_VS_PORTS = 'book_vs_ports.json'
FILENAME_MATRIX_CURRENT = 'matrix_current.json'
FILENAME_TAG_HISTO = 'tag_histo.json'

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

from minio import Minio
from minio.error import ResponseError
minioClient = Minio(
    os.getenv("S3_HOST").replace('https://', '').replace('http://', ''),
    access_key=os.getenv("S3_ACCESSKEY"),
    secret_key=os.getenv("S3_SECRETKEY"),
    secure=os.getenv("S3_HOST")[:5].upper() == 'https'.upper()
)


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

def datamodel_tableau_hive():
    return [{'field': 'ticker.given', 'hiveDatatype': 'STRING'}]

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

            data_datetime = df['_index'].values[0].replace("central-", "")

            df['data.datetime'] = data_datetime
            df.to_csv(os.path.join(UPLOAD_FOLDER, 'tableau_s3.csv'), sep=",", index=False, columns=[ f['field'] for f in datamodel_tableau_hive() ])

            minioClient.fput_object('tableau', f'histo/tableau_{data_datetime}.csv', os.path.join(UPLOAD_FOLDER, 'tableau_s3.csv'))
            minioClient.fput_object('tableau', f'last/tableau.csv', os.path.join(UPLOAD_FOLDER, 'tableau_s3.csv'))


            app.logger.info(f'len file: {len(df)}')

            try:
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
@app.route('/tableau/data/centrale/last')
def tableau_data_centrale_last():
    #df = pd.read_csv( f'{UPLOAD_FOLDER}{FILENAME_TABLEAU}', sep=";" )
    df = prepare_dataset()

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )
    return jsonify( df[0:5].to_dict(orient='records') )


@app.route('/tableau/data/centrale/last/light')
def tableau_data_centrale_last_light():
    df = prepare_dataset()

    cols = df.columns

    cols_to_remove = ['_index', '_type', '_id',
                      'raw.sources.bbg.data.CRNCY', 'derived.data.priceFundamentalStartYear.value', 'derived.data.capiLocalCrncy.localValueInBln',
                      'asset.COUNTRY', 'asset.COUNTRY_ISO.ISOALPHA3Code', 'asset.COUNTRY_ISO.name', 'asset.region.Level1', 'asset.region.Level2', 'raw.sources.bbg.data.REL_INDEX',
                      'raw.sources.bbg.data.VOLATILITY_30D', 'raw.sources.bbg.data.VOLATILITY_180D',
                      'raw.sources.bbg.data.BEST_4W_CHG_CUR_YR', 'raw.sources.bbg.data.BEST_4W_CHG_NXT_YR', 'raw.sources.bbg.data.BEST_EST_LONG_TERM_GROWTH', 'raw.sources.bbg.data.IS_COMP_EPS_EXCL_STOCK_COMP', 'raw.sources.bbg.data.IS_DIL_EPS_CONT_OPS', 'raw.sources.bbg.data.EEPS_CURR_YR', 'raw.sources.bbg.data.EEPS_NXT_YR', 'raw.sources.bbg.data.BEST_AEPS_LST_QTR', 'raw.sources.bbg.data.BEST_EEPS_LAST_QTR', 'raw.sources.bbg.data.EPS_SURPRISE_LAST_QTR', 'raw.sources.bbg.data.BEST_AEPS_LST_YR', 'raw.sources.bbg.data.BEST_EEPS_LAST_YR', 'raw.sources.bbg.data.EPS_SURPRISE_LAST_ANNUAL', 'raw.sources.bbg.data.EPS_BEF_XO_3YR_GEO_GROWTH', 'raw.sources.bbg.data.5Y_GEO_GROWTH_DILUTED_EPS', 'raw.sources.bbg.data.R_SQUARED_DIL_EPS_CONT_OPS', 'raw.sources.bbg.data.R_SQUARED_BAS_EPS_BEF_XO', 'raw.sources.bbg.data.BEST_EPS_3MO_PCT_CHG', 'raw.sources.bbg.data.BEST_EPS_6MO_PCT_CHG', 'raw.sources.bbg.data.PX_TO_CASH_FLOW', 'raw.sources.bbg.data.BEST_PE_RATIO', 'raw.sources.bbg.data.BEST_PX_SALES_RATIO', 'raw.sources.bbg.data.FIVE_YEAR_AVG_PRICE_SALES', 'raw.sources.bbg.data.EV_TO_T12M_SALES', 'raw.sources.bbg.data.BEST_PX_CPS_RATIO', 'raw.sources.bbg.data.FIVE_YEAR_AVG_PRICE_CASHFLOW', 'raw.sources.bbg.data.BEST_CURRENT_EV_BEST_SALES', 'raw.sources.bbg.data.BEST_CUR_EV_TO_EBITDA', 'raw.sources.bbg.data.PE_RATIO', 'raw.sources.bbg.data.FIVE_YR_AVG_PRICE_EARNINGS', 'raw.sources.bbg.data.BEST_DIV_YLD',
                       'models.GROWTH.components.CURRENT_EPSMthChg.eval', 'models.GROWTH.components.CURRENT_EPSMthChg.toRank', 'models.GROWTH.components.PAST_EPSStability.eval', 'models.GROWTH.components.PAST_EPSStability.toRank', 'models.GROWTH.components.CURRENT_BEstEPS4WeekChangeNextYear.eval', 'models.GROWTH.components.CURRENT_BEstEPS4WeekChangeNextYear.toRank', 'models.GROWTH.components.PAST_EPSGrowthYr.eval', 'models.GROWTH.components.PAST_EPSGrowthYr.toRank', 'models.GROWTH.components.CURRENT_BEstEPS4WeekChangeCurrentYear.eval', 'models.GROWTH.components.CURRENT_BEstEPS4WeekChangeCurrentYear.toRank', 'models.GROWTH.components.NEXT_EPSGrowth.eval', 'models.GROWTH.components.NEXT_EPSGrowth.toRank', 'models.GROWTH.components.CURRENT_RatioEPSCurrentYearLastEPS.eval', 'models.GROWTH.components.CURRENT_RatioEPSCurrentYearLastEPS.toRank', 'models.GROWTH.components.CURRENT_EPSSurprise.eval', 'models.GROWTH.components.CURRENT_EPSSurprise.toRank', 'models.GROWTH.components.CURRENT_RatioEPSNextYrCurrentYr.eval', 'models.GROWTH.components.CURRENT_RatioEPSNextYrCurrentYr.toRank',
                       'models.RV.components.PX_TO_CASH_FLOW.eval', 'models.RV.components.PX_TO_CASH_FLOW.toRank', 'models.RV.components.BEST_PE_RATIO.eval', 'models.RV.components.BEST_PE_RATIO.toRank', 'models.RV.components.BEST_PX_SALES_RATIO/FIVE_YEAR_AVG_PRICE_SALES.eval', 'models.RV.components.BEST_PX_SALES_RATIO/FIVE_YEAR_AVG_PRICE_SALES.toRank', 'models.RV.components.EV_TO_T12M_SALES.eval', 'models.RV.components.EV_TO_T12M_SALES.toRank', 'models.RV.components.BEST_PX_CPS_RATIO/FIVE_YEAR_AVG_PRICE_CASHFLOW.eval', 'models.RV.components.BEST_PX_CPS_RATIO/FIVE_YEAR_AVG_PRICE_CASHFLOW.toRank', 'models.RV.components.BEST_CURRENT_EV_BEST_SALES.eval', 'models.RV.components.BEST_CURRENT_EV_BEST_SALES.toRank', 'models.RV.components.BEST_CUR_EV_TO_EBITDA.eval', 'models.RV.components.BEST_CUR_EV_TO_EBITDA.toRank', 'models.RV.components.PE_RATIO.eval', 'models.RV.components.PE_RATIO.toRank', 'models.RV.components.BEST_PE_RATIO/FIVE_YR_AVG_PRICE_EARNINGS.eval', 'models.RV.components.BEST_PE_RATIO/FIVE_YR_AVG_PRICE_EARNINGS.toRank', 'models.RV.components.BEST_DIV_YLD.eval', 'models.RV.components.BEST_DIV_YLD.toRank', 'models.RV.components.PX_TO_CASH_FLOW/FIVE_YEAR_AVG_PRICE_CASHFLOW.eval', 'models.RV.components.PX_TO_CASH_FLOW/FIVE_YEAR_AVG_PRICE_CASHFLOW.toRank',
                       'models.MF.scoring.chg.1m', 'models.RSST.scoring.chg.1m', 'models.LOWVOL.scoring.chg.1m', 'models.RV.scoring.chg.1m', 'models.EQ.scoring.chg.1m', 'models.SALES.scoring.chg.1m', 'models.SMARTSENT.scoring.chg.1m',
                       'raw.sources.bbg.data.HIST_PUT_IMP_VOL', 'raw.sources.bbg.data.BEST_TARGET_3MO_CHG', 'raw.sources.bbg.data.LATEST_ANN_DT_QTRLY', 'raw.sources.bbg.data.EXPECTED_REPORT_DT', 'raw.sources.bbg.data.EXPECTED_REPORT_TIME', 'raw.sources.bbg.data.SKEW_MONEYNESS_SPREAD', 'raw.sources.bbg.data.EARNINGS_RELATED_IMPLIED_MOVE', 'raw.sources.bbg.data.PUT_CALL_OPEN_INTEREST_RATIO', 'raw.sources.bbg.data.1M_SHORT_INT_PCT', 'raw.sources.bbg.data.PX_LAST', 'raw.sources.bbg.data.CHG_PCT_5D', 'raw.sources.bbg.data.CHG_PCT_30D', 'raw.sources.bbg.data.CHG_PCT_100D', 'raw.sources.bbg.data.CHG_PCT_YTD', 'raw.sources.bbg.data.RSI_14D', 'raw.sources.bbg.data.MOV_AVG_20D' 'raw.sources.bbg.data.MOV_AVG_50D', 'raw.sources.bbg.data.MOV_AVG_200D', 'raw.sources.bbg.data.HIGH_52WEEK', 'raw.sources.bbg.data.LOW_52WEEK', 'raw.sources.bbg.data.NET_DEBT_TO_EBITDA', 'raw.sources.bbg.data.REL_5D', 'reactiveData_date', 'models.rMF.scoring.final_score', 'models.rLOWVOL.scoring.final_score', 'models.rRSST.scoring.final_score', 'models.rEPS.scoring.chg.previous', 'models.rMF.scoring.chg.previous', 'models.rLOWVOL.scoring.chg.previous', 'models.rRSST.scoring.chg.previous', 'raw.sources.bbg.data.BEST_PE_RATIO@CY+4' ]

    #patch missing values
    df = df[ [col for col in cols if col not in cols_to_remove] ]
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


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
        'ticker.given': 'S 1 COMDTY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'SOYBEAN',
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
        'ticker.given': 'VXX US EQUITY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'IPATH SERIES B S&P 500 VIX',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'VOLATILITY'
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
        'ticker.given': 'FTSEMIB INDEX',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'FTSE MIB INDEX',
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
        'ticker.given': 'QQQ US EQUITY',
        'asset.GICS_SECTOR_NAME': 'INDEX',
        'asset.NAME': 'INVESCO QQQ TRUST SERIES 1',
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
        'ticker.given': 'IBB US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Health Care',
        'asset.NAME': 'ISHARES NASDAQ BIOTECHNOLOGY',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'KRE US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Financials',
        'asset.NAME': 'SPDR S&P REGIONAL BANKING',
        'asset.CRNCY': 'USD',
        'asset.region.MatrixRegion': 'U.S.A.',
        'exposureType': 'EQUITY'
    }, {
        'ticker.given': 'ROBO US EQUITY',
        'asset.GICS_SECTOR_NAME': 'Information Technology',
        'asset.NAME': 'ROBO GLOBAL ROBOTICS AND AUT',
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
                            'asset.CRNCY': None,
                            'asset.GICS_SECTOR_NAME': None,
                            'asset.GICS_INDUSTRY_GROUP_NAME': None,
                            'asset.GICS_INDUSTRY_NAME': None,
                            'asset.region.MatrixRegion': None,
                        }
                    )

        df_openPosNotInUniverse = pd.DataFrame(list_openPosNotInUniverse)
        df_openPosNotInUniverse = df_openPosNotInUniverse.drop_duplicates(subset='ticker.given')

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

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}', orient="records" )

        # append new content
        new = pd.DataFrame( request.get_json()['data'] )
        combis = new.groupby(['portfolio_name', 'portfolio_date']).size().reset_index().to_dict(orient='records')

        for combi in combis:
            mask  = df[ (df['portfolio_name'] == combi['portfolio_name']) & (df['portfolio_date'] == combi['portfolio_date']) ]
            df = df.drop( mask.index )

        df = pd.concat( [df, new] )

    else:
        df = pd.DataFrame( request.get_json()['data'] )


    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/scport', methods=['GET'])
def tableau_data_scport():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}', orient="records" )

        # processing
        df['position_ticker'] = df['position_ticker'].apply(patch_ticker_marketplace)

        combis = df.groupby(['portfolio_name']).size().reset_index().to_dict(orient='records')

        list_df = []
        for combi in combis:
            df_prt_histo  = df[ df['portfolio_name'] == combi['portfolio_name'] ]

            df_prt_histo['is_last'] = False
            df_prt_histo.loc[  df_prt_histo['portfolio_date'] == df_prt_histo['portfolio_date'].max(), 'is_last' ] = True

            list_df.append(df_prt_histo)

        df = pd.concat(list_df)

    else:
        df = pd.DataFrame([])



    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/scport/histo', methods=['GET'])
def tableau_data_scport_histo():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}' ):
        df_scport_histo = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}', orient="records" )

        df_scport_histo['position_ticker'] = df_scport_histo['position_ticker'].apply(patch_ticker_marketplace)

        list_df = []
        for prt in df_scport_histo['portfolio_name'].unique():
            df_select_prt = df_scport_histo[ df_scport_histo['portfolio_name'] == prt ]

            df_select_prt_notLast = df_select_prt[ df_select_prt['portfolio_date'] != max(df_select_prt['portfolio_date']) ]
            df_select_prt_notLast['is_last'] = False

            df_select_prt_last = df_select_prt[ df_select_prt['portfolio_date'] == max(df_select_prt['portfolio_date']) ]
            df_select_prt_last['portfolio_date'] = pd.to_datetime('today').date()
            df_select_prt_last['is_last'] = True

            df_select_prt = pd.concat([df_select_prt_notLast, df_select_prt_last])
            df_select_prt.reset_index(drop=True, inplace=True)

            for ticker in df_select_prt['position_ticker'].unique():
                df_select_prt_ticker = df_select_prt[ df_select_prt['position_ticker'] == ticker ]
                df_select_prt_ticker.set_index(pd.DatetimeIndex(df_select_prt_ticker.portfolio_date), inplace=True)
                df_select_prt_ticker = df_select_prt_ticker.resample('D').pad()
                df_select_prt_ticker.portfolio_date = df_select_prt_ticker.index.values
                df_select_prt_ticker.reset_index(drop=True, inplace=True)

                list_df.append( df_select_prt_ticker )


        df_scport_histo = pd.concat(list_df)
        df_scport_histo.reset_index(drop=True, inplace=True)

        df_scport_histo = df_scport_histo.sort_values(['portfolio_date'], ascending=True)

        df = df_scport_histo

        df['portfolio_date'] = df['portfolio_date'].dt.strftime("%Y-%m-%d")


    else:
        df = pd.DataFrame([])

    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/scport/last', methods=['GET'])
def tableau_data_scport_last():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}', orient="records" )

        df['position_ticker'] = df['position_ticker'].apply(patch_ticker_marketplace)

        combis = df.groupby(['portfolio_name']).size().reset_index().to_dict(orient='records')

        list_df = []
        for combi in combis:
            df_prt_histo  = df[ df['portfolio_name'] == combi['portfolio_name'] ]

            df_prt_last = df_prt_histo[ df_prt_histo['portfolio_date'] == df_prt_histo['portfolio_date'].max() ]

            df_prt_last['is_last'] = True

            list_df.append(df_prt_last)

        df = pd.concat(list_df)

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/bookexposure/upload', methods=['POST'])
@basic_auth.required
def tableau_data_bookexposure_upload():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}', orient="records" )

        new = pd.DataFrame( request.get_json()['data'] )
        combis = new.groupby(['snapshot_datetime']).size().reset_index().to_dict(orient='records')

        for combi in combis:
            mask  = df[ df['snapshot_datetime'] == combi['snapshot_datetime'] ]
            df = df.drop( mask.index )

        df = pd.concat( [df, new], sort=False )

    else:
        df = pd.DataFrame( request.get_json()['data'] )



    # processing
    df['position_dailyPnlLocal'] = ((df['asset_price']-df['asset_priceClose'])*df['position_qtyCurrent']*df['asset_multiplier']+df['position_ntcfIntradayLocal']+(df['position_qtyCurrent']-df['position_qtyClose'])*df['asset_priceClose']*df['asset_multiplier'])
    df['position_dailyPnlBase'] = df['position_dailyPnlLocal'] * df['position_fxRate']

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )



@app.route('/tableau/data/bookexposure/diff', methods=['POST'])
@basic_auth.required
def tableau_data_bookexposure_diff():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}', orient="records" )

        matrix_parameters =  request.get_json()['parameters']
        print(matrix_parameters)
        new = pd.DataFrame( request.get_json()['data'] )
        combis = new.groupby(['snapshot_datetime']).size().reset_index().to_dict(orient='records')

        for combi in combis:
            mask  = df[ df['snapshot_datetime'] == combi['snapshot_datetime'] ]
            df = df.drop( mask.index )

        df = pd.concat( [df, new], sort=False )

        df['internal_underlyingTicker'] = df['internal_underlyingTicker'].apply(patch_ticker_marketplace)

    else:
        df = pd.DataFrame( request.get_json()['data'] )



    # processing
    df['position_dailyPnlLocal'] = ((df['asset_price']-df['asset_priceClose'])*df['position_qtyCurrent']*df['asset_multiplier']+df['position_ntcfIntradayLocal']+(df['position_qtyCurrent']-df['position_qtyClose'])*df['asset_priceClose']*df['asset_multiplier'])
    df['position_dailyPnlBase'] = df['position_dailyPnlLocal'] * df['position_fxRate']

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}', orient='records' )


    # compute content for sc vs port - JG notebook
    df_port = df [ df['snapshot_datetime'] == max( df['snapshot_datetime'] ) ]  # book

    print('-- book: --')
    with pd.option_context('display.max_rows', 1000):  # more options can be specified also
        print(df_port[ ['bbg_ticker', 'internal_underlyingTicker', 'position_qtyCurrent', 'position_tag'] ])
    print('---')

    #df_port = pd.read_json( tableau_data_bookexposure_last() )

    df_sc = pd.read_json( tableau_data_scport_last().get_data() ) # bbg port

    df_stat = pd.read_json( tableau_data_centrale_last().get_data() )

    df_sc = pd.merge(df_sc, df_stat, how = 'left', left_on = 'position_ticker', right_on = 'ticker.given')

    df_port = pd.merge(df_port, df_stat, how = 'left', left_on = 'internal_underlyingTicker', right_on = 'ticker.given')

    df_port.groupby(['asset.region.MatrixRegion'])['position_underlying_NavPct'].agg('sum')

    wUS_L = matrix_parameters['wUS_L']
    wEU_L = matrix_parameters['wEU_L']
    wAS_L = matrix_parameters['wAS_L']
    wJ_L = matrix_parameters['wJ_L']
    wUS_S = -1*wUS_L/3
    wEU_S = -1*wEU_L/3


    #general conditions
    long = df_port['position_underlying_NavPct'] >= 0
    short = df_port['position_underlying_NavPct'] < 0
    eq = df_port['asset.GICS_SECTOR_NAME']!='INDEX'

    #  --- europe

    # book EU long
    reg = df_port['asset.region.MatrixRegion'] == 'Europe'
    df_port_euL = df_port[reg & long & eq]
    df_port_euL['BOOK'] = 'BOOK EU LONG'

    # SC EU long
    s_eu = (df_sc['portfolio_name'] == 'SC SXXP LONG')|(df_sc['portfolio_name'] == 'SC VOLEPS EU')

    df_sc_euL = df_sc[s_eu]
    if df_sc_euL.position_ticker.nunique()*wEU_L!=0:
        df_sc_euL['SCweight'] = 1/df_sc_euL.position_ticker.nunique()*wEU_L
    else:
         df_sc_euL['SCweight'] = 0

    df_eu_long = pd.merge(df_sc_euL, df_port_euL, how = 'outer', left_on = 'position_ticker', right_on = 'internal_underlyingTicker')

    # book EU short
    reg = df_port['asset.region.MatrixRegion'] == 'Europe'
    df_port_euS = df_port[reg & short & eq]
    df_port_euS['BOOK'] = 'BOOK EU SHORT'
    tot_weiS = df_port_euS.groupby(['asset.region.MatrixRegion'])['position_underlying_NavPct'].agg('sum')[0]

    # SC EU short
    s_euS = df_sc['portfolio_name'] == 'SC SXXP SHORT'
    df_sc_euS = df_sc[s_euS]
    if df_sc_euS.position_ticker.nunique()*wEU_S!=0:
        df_sc_euS['SCweight'] = 1/df_sc_euS.position_ticker.nunique()*wEU_S
    else:
        df_sc_euS['SCweight'] = 0

    df_eu_short = pd.merge(df_sc_euS, df_port_euS, how = 'outer', left_on = 'position_ticker', right_on = 'internal_underlyingTicker')


    # --- usa

    # book USA long
    reg1 = df_port['asset.region.MatrixRegion'] == 'U.S.A.'
    df_port_usL = df_port[reg1 & long & eq]
    df_port_usL['BOOK'] = 'BOOK USA LONG'
    #tot_weiU = df_port_usL.groupby(['asset.region.MatrixRegion'])['position_underlying_NavPct'].agg('sum')[0]

    # SC USA long
    s_us = (df_sc['portfolio_name'] == 'SC SPX LONG')|(df_sc['portfolio_name'] == 'SC VOLEPS US')
    df_sc_usL = df_sc[s_us]
    if df_sc_usL.position_ticker.nunique()*wUS_L!=0:
        df_sc_usL['SCweight'] = 1/df_sc_usL.position_ticker.nunique()*wUS_L
    else:
         df_sc_usL['SCweight'] = 0

    df_us_long = pd.merge(df_sc_usL, df_port_usL, how = 'outer', left_on = 'position_ticker', right_on = 'internal_underlyingTicker')


    # book USA short
    df_port_usS = df_port[reg1 & short & eq]
    df_port_usS['BOOK'] = 'BOOK USA SHORT'
    #tot_weiUs = df_port_usS.groupby(['asset.region.MatrixRegion'])['position_underlying_NavPct'].agg('sum')[0]

    # SC USA short
    s_usS = df_sc['portfolio_name'] == 'SC US SHORT'
    df_sc_usS = df_sc[s_usS]
    if df_sc_usS.position_ticker.nunique()*wUS_S!=0:
        df_sc_usS['SCweight'] = 1/df_sc_usS.position_ticker.nunique()*wUS_S
    else:
        df_sc_usS['SCweight'] = 0

    df_us_short = pd.merge(df_sc_usS, df_port_usS, how = 'outer', left_on = 'position_ticker', right_on = 'internal_underlyingTicker')


    # --- emerging

    # book Asia long
    reg1 = df_port['asset.region.MatrixRegion'] == 'Emerging'
    df_port_asL = df_port[reg1 & long & eq]
    df_port_asL['BOOK'] = 'BOOK ASIA LONG'
    #tot_weiU = df_port_usL.groupby(['asset.region.MatrixRegion'])['position_underlying_NavPct'].agg('sum')[0]

    # SC Asia long
    s_a = df_sc['portfolio_name'] == 'SC ASIA LONG'
    df_sc_asL = df_sc[s_a]
    if df_sc_asL.position_ticker.nunique()*wAS_L!=0:
        df_sc_asL['SCweight'] = 1/df_sc_asL.position_ticker.nunique()*wAS_L
    else:
        df_sc_asL['SCweight'] = 0

    df_as_long = pd.merge(df_sc_asL, df_port_asL, how = 'outer', left_on = 'position_ticker', right_on = 'internal_underlyingTicker')


    # --- japan
    # book Japan long
    reg1 = df_port['asset.region.MatrixRegion'] == 'Japan'
    df_port_jpL = df_port[reg1 & long & eq]
    df_port_jpL['BOOK'] = 'BOOK JAPAN LONG'
    #tot_weiU = df_port_usL.groupby(['asset.region.MatrixRegion'])['position_underlying_NavPct'].agg('sum')[0]

    # SC Japan long
    s_j = df_sc['portfolio_name'] == 'SC JAPAN LONG'
    df_sc_jpL = df_sc[s_j]
    if df_sc_jpL.position_ticker.nunique()*wJ_L!=0:
        df_sc_jpL['SCweight'] = 1/df_sc_jpL.position_ticker.nunique()*wJ_L
    else:
        df_sc_jpL['SCweight'] = 0

    df_jp_long = pd.merge(df_sc_jpL, df_port_jpL, how = 'outer', left_on = 'position_ticker', right_on = 'internal_underlyingTicker')

    df_jp_long.head()

    df_final = pd.concat([df_eu_long,df_eu_short,df_us_long,df_us_short,df_as_long,df_jp_long], ignore_index=True,sort = False)


    for index, row in df_final.iterrows():
        val = row['position_ticker']
        if row['position_ticker'] != row['position_ticker']:
            val = row['ticker.given_y']
        df_final.at[index,'TICKER'] = val

    df_fin = df_final[['TICKER','BOOK','portfolio_name','position_underlying_NavPct','SCweight', 'portfolio_date', 'snapshot_date']]


    df_export = df_fin
    df_export.rename(columns={'TICKER': 'ticker', 'BOOK': 'book_name', 'portfolio_name': 'sc_portfolio_name', 'position_underlying_NavPct': 'book_weight', 'SCweight': 'sc_weight'}, inplace=True)

    df_export.to_csv( f'{UPLOAD_FOLDER}verif_book_vs_port.csv' )

    df_export.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_BOOK_VS_PORTS}', orient='records' )




    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
        'parameters': matrix_parameters
    } )


@app.route('/tableau/data/bookexposure', methods=['GET'])
def tableau_data_bookexposure():
    #return redirect(url_for('tableau_data_bookexposure_histo_full'))
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}', orient="records" )

        df['internal_underlyingTicker'] = df['internal_underlyingTicker'].apply(patch_ticker_marketplace)
        df['position_tag'] = df['position_tag'].str.lower()

        df['is_last'] = False
        df.loc[ df['snapshot_datetime'] == df['snapshot_datetime'].max(), 'is_last' ] = True

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/bookexposure/histo/full', methods=['GET'])
def tableau_data_bookexposure_histo_full():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}', orient="records" )

        df['internal_underlyingTicker'] = df['internal_underlyingTicker'].apply(patch_ticker_marketplace)
        df['position_tag'] = df['position_tag'].str.lower()

        df['is_last'] = False
        df.loc[ df['snapshot_datetime'] == df['snapshot_datetime'].max(), 'is_last' ] = True

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/bookexposure/histo', methods=['GET']) # max 1 snap / day
def tableau_data_bookexposure_histo():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}', orient="records" )

        df['internal_underlyingTicker'] = df['internal_underlyingTicker'].apply(patch_ticker_marketplace)
        df['position_tag'] = df['position_tag'].str.lower()

        df['is_last'] = False
        df.loc[ df['snapshot_datetime'] == df['snapshot_datetime'].max(), 'is_last' ] = True

        df = df.sort_values(['snapshot_date', 'snapshot_datetime'], ascending=True)
        df = df.drop_duplicates(subset=['snapshot_date', 'position_id'], keep='last')

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/bookexposure/last', methods=['GET'])
def tableau_data_bookexposure_last():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}', orient="records" )

        df = df [ df['snapshot_datetime'] == df['snapshot_datetime'].max() ]
        df['is_last'] = True

    else:
        df = pd.DataFrame([])

    # processing
    df['internal_underlyingTicker'] = df['internal_underlyingTicker'].apply(patch_ticker_marketplace)

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/bookvsports/upload', methods=['POST'])
@basic_auth.required
def tableau_data_bookvsports_upload():
    df = pd.DataFrame( request.get_json()['data'] )

    # processing

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_BOOK_VS_PORTS}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )


@app.route('/tableau/data/bookvsports', methods=['GET'])
def tableau_data_bookvsports():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BOOK_VS_PORTS}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BOOK_VS_PORTS}', orient="records" )

    else:
        df = pd.DataFrame([])

    # processing
    df['ticker'] = df['ticker'].apply(patch_ticker_marketplace)

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/matrixcurrent/upload', methods=['POST'])
@basic_auth.required
def tableau_data_matrixcurrent_upload():
    with open(f'{UPLOAD_FOLDER}{FILENAME_MATRIX_CURRENT}', 'w') as f:
        f.write( json.dumps(request.get_json()['data']) )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(request.get_json()['data']),
    } )


@app.route('/tableau/data/matrixcurrent', methods=['GET'])
def tableau_data_matrixcurrent():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_MATRIX_CURRENT}' ):
        with open(f'{UPLOAD_FOLDER}{FILENAME_MATRIX_CURRENT}', 'r') as f:
            for row in f:
                return jsonify( json.loads(row) )
    else:
        return jsonify( [] )


@app.route('/tableau/data/matrix/sectors', methods=['GET'])
def tableau_data_matrix_flat():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_MATRIX_CURRENT}' ):
        with open(f'{UPLOAD_FOLDER}{FILENAME_MATRIX_CURRENT}', 'r') as f:
            for row in f:
                data = json.loads(row)
                break
        dfm = pd.DataFrame(data)
        sectors_th = pd.DataFrame()

        for region in [ {'region': 'U.S.A.', 'sheet': 'Matrix Sector EU' }, {'region': 'Europe', 'sheet': 'Matrix sector US' }]:

            dd = pd.DataFrame(dfm['criterias'][dfm['sheet']==region['sheet']]).reset_index()

            for l in range(len(dd)):
                ddd = pd.DataFrame(dd['criterias'][l])
                sector = ddd[ddd['criteria']=='gics'].reset_index()['value'][0]
                weight = ddd[ddd['criteria']=='weightText'].reset_index()['value'][0]
                rank = ddd[ddd['criteria']=='sectorRankingRank'].reset_index()['value'][0]
                bk_wei = ddd[ddd['criteria']=='WeightInBenchmark'].reset_index()['value'][0]

                ss = {'region':region,'sector':sector,'matrix_reco':weight,'rank':rank,'bk_wei':bk_wei,'data_date': dfm['data_date'].values[0]}
                ds = pd.DataFrame(ss)
                sectors_th = sectors_th.append(ds, ignore_index=True)

        sectors_th = sectors_th.where((pd.notnull(sectors_th)), None)

        return jsonify( sectors_th.to_dict(orient='records') )
    else:
        return jsonify( [] )


@app.route('/tableau/data/tag/upload', methods=['POST'])
@basic_auth.required
def tableau_data_tag_upload():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_TAG_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_TAG_HISTO}', orient="records" )

        # append new content
        new = pd.DataFrame( request.get_json()['data'] )

        combis = new.groupby(['source', 'srcDate']).size().reset_index().to_dict(orient='records')

        for combi in combis:
            mask  = df[ (df['source'] == combi['source']) & (df['srcDate'] == combi['srcDate']) ]
            df = df.drop( mask.index )

        df = pd.concat( [df, new] )


    else:
        df = pd.DataFrame( request.get_json()['data'] )

    df.to_json( path_or_buf=f'{UPLOAD_FOLDER}{FILENAME_TAG_HISTO}', orient='records' )

    return jsonify( {
        'status': 'ok',
        'submittedDatetime': datetime.datetime.now().isoformat(),
        'data': len(df),
    } )



def get_tag_processing(tag):
    if tag == None:
        return None
    if 'Core_' in tag or  (' VOL' in tag and 'EPS' in tag):
        prefix = 'LOWVOL'
    elif 'SC' in tag[:3]:
        if 'SHORT' in tag:
            prefix= 'SHORT'
        else:
            prefix= 'QUANTAMENTAL'
    elif 'TT' in tag[:3]:
        prefix = 'TACTICAL'
    elif 'CONVEXITY' in tag:
        prefix = 'CONVEXITY'
    elif 'IPO' in tag:
        prefix = 'IPO'
    elif 'U2' in tag:
        prefix = 'U2'
    elif 'DG' in tag or 'UG':
        prefix = 'UG/DG'
    else:
        prefix = ''

    # region
    if '_US_' in tag or 'SPX' in tag or ' US' in tag:
        region = "US"
    elif '_EU_' in tag or 'SXXP' in tag or ' EU ' in tag:
        region = "EU"
    elif 'US' in tag:
        region = 'US'
    elif 'EU' in tag:
        region = 'EU'
    elif 'ASIA' in tag:
        region = "EMERGING"
    elif 'JP' in tag or 'JAPAN' in tag:
        region = 'JAPAN'
    else:
        #region = "OTHER"
        region = ""

    return f'{prefix} {region}'.rstrip().lstrip()



def compute_tag_priority(tag):
    if tag == None:
        return 0
    score = 0
    if 'QUANT' in tag or 'SHORT' in tag:
        score += 1
    elif 'LOWVOL ' in tag:
        score += 10
    else:
        score += 20
    return score


@app.route('/tableau/data/tag/histo', methods=['GET'])
def tableau_data_tag_histo():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_TAG_HISTO}' ):
        df_tag_histo = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_TAG_HISTO}', orient="records" )

        # start of the fund
        #df_tag_histo = df_tag_histo[ df_tag_histo['srcDate'] >= '2018-05-01' ]
        df_tag_histo['tag'] = df_tag_histo['tag'].apply(get_tag_processing)
        df_tag_histo['tag_priority'] = df_tag_histo['tag'].apply(compute_tag_priority)
        df_tag_histo['ticker'] = df_tag_histo['ticker'].apply(patch_ticker_marketplace)

        list_df = []
        for tag in df_tag_histo['tag'].unique():
            df_select_tag = df_tag_histo[ df_tag_histo['tag'] == tag ]

            df_select_tag_last = df_select_tag[ df_select_tag['srcDate'] == max(df_select_tag['srcDate']) ]
            df_select_tag_last['srcDate'] = pd.to_datetime('today').date()

            df_select_tag = pd.concat([df_select_tag, df_select_tag_last])
            df_select_tag.reset_index(drop=True, inplace=True)

            for ticker in df_select_tag['ticker'].unique():
                df_select_tag_ticker = df_select_tag[ df_select_tag['ticker'] == ticker ]

                df_select_tag_ticker.set_index(pd.DatetimeIndex(df_select_tag_ticker.srcDate), inplace=True)
                df_select_tag_ticker = df_select_tag_ticker.resample('D').pad()
                df_select_tag_ticker.srcDate = df_select_tag_ticker.index.values
                df_select_tag_ticker.reset_index(drop=True, inplace=True)

                list_df.append( df_select_tag_ticker )

        df_tag_histo = pd.concat(list_df)
        df_tag_histo.reset_index(drop=True, inplace=True)



        df_tag_histo = df_tag_histo.sort_values(['srcDate', 'tag_priority'], ascending=True)
        df = df_tag_histo.drop_duplicates(subset=['srcDate', 'ticker'], keep='first')

        df['is_last'] = False
        df.loc[  df['srcDate'] == pd.to_datetime('today').date(), 'is_last' ] = True

        df['srcDate'] = df['srcDate'].dt.strftime("%Y-%m-%d")

    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/tag', methods=['GET'])
def tableau_data_tag():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_TAG_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_TAG_HISTO}', orient="records" )

        # start of the fund
        df = df[ df['srcDate'] >= '2018-05-01' ]

        df['ticker'] = df['ticker'].apply(patch_ticker_marketplace)

        df['tag'] = df['tag'].apply(get_tag_processing)

        combis = df.groupby(['source', 'tag']).size().reset_index().to_dict(orient='records')

        list_df = []
        for combi in combis:
            df_srcTag  = df[ (df['source'] == combi['source']) & (df['tag'] == combi['tag']) ]

            df_srcTag['is_last'] = False
            df_srcTag.loc[  df_srcTag['srcDate'] == df_srcTag['srcDate'].max(), 'is_last' ] = True

            list_df.append(df_srcTag)

        df = pd.concat(list_df)
        df.reset_index(drop=True, inplace=True)
    else:
        df = pd.DataFrame([])

    #patch missing values
    df = df.where((pd.notnull(df)), None)

    return jsonify( df.to_dict(orient='records') )


@app.route('/tableau/data/tag/last', methods=['GET'])
def tableau_data_tag_last():

    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_TAG_HISTO}' ):
        df = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_TAG_HISTO}', orient="records" )

        df['ticker'] = df['ticker'].apply(patch_ticker_marketplace)

        df['original_tag'] = df['tag']
        df['tag'] = df['tag'].apply(get_tag_processing)
        df['tag_priority'] = df['tag'].apply(compute_tag_priority)

        combis = df.groupby(['source', 'tag']).size().reset_index().to_dict(orient='records')

        list_df = []
        for combi in combis:
            df_srcTag  = df[ (df['source'] == combi['source']) & (df['tag'] == combi['tag']) ]

            df_srcTag_last = df_srcTag[ df_srcTag['srcDate'] == df['srcDate'].max() ]
            df_srcTag_last['is_last'] = True
            list_df.append(df_srcTag_last)

        df = pd.concat(list_df)


    else:
        df = pd.DataFrame([])

    # merge with scport
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}' ):
        df_bbgPort = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BBG_SC_PORTS_HISTO}', orient="records" )

        df_bbgPort['position_ticker'] = df_bbgPort['position_ticker'].apply(patch_ticker_marketplace)

        combis = df_bbgPort.groupby(['portfolio_name']).size().reset_index().to_dict(orient='records')

        list_df = []
        for combi in combis:
            df_prt_histo  = df_bbgPort[ df_bbgPort['portfolio_name'] == combi['portfolio_name'] ]

            df_prt_last = df_prt_histo[ df_prt_histo['portfolio_date'] == df_prt_histo['portfolio_date'].max() ]

            df_prt_last['is_last'] = True

            list_df.append(df_prt_last)

        df_bbgPort = pd.concat(list_df)

        df_bbgPort['source'] = 'bbgPort'
        df_bbgPort['port_tag'] = df_bbgPort['portfolio_name'].str.upper()
        df_bbgPort['port_tag'] = df_bbgPort['port_tag'].apply(get_tag_processing)
        df_bbgPort['tag_priority'] = df_bbgPort['port_tag'].apply(compute_tag_priority)




        df_bbgPort = df_bbgPort.rename(columns={
                                          'position_ticker': 'ticker',
                                          'port_tag': 'tag',
                                          'portfolio_name': 'original_tag',
                                          'portfolio_date': 'srcDate'
                                          })

    else:
        df_bbgPort = pd.DataFrame([])



    # merge with book
    if os.path.isfile( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}' ):
        df_book = pd.read_json( f'{UPLOAD_FOLDER}{FILENAME_BOOK_EXPOSURE_HISTO}', orient="records" )

        df_book = df_book [ df_book['snapshot_datetime'] == df_book['snapshot_datetime'].max() ]
    else:
        df_book = pd.DataFrame([])
    df_book = df_book[ ['internal_underlyingTicker', 'snapshot_datetime', 'position_tag'] ]
    df_book['snapshot_date'] = df_book['snapshot_datetime'].str[:10]
    df_book['source'] = 'book'
    df_book['is_last'] = True
    df_book = df_book.dropna(subset=['position_tag'])
    df_book['position_tag'] = df_book['position_tag'].str.upper()
    df_book['original_tag']  = df_book['position_tag']
    df_book['position_tag'] = df_book['position_tag'].apply(get_tag_processing)
    df_book['tag_priority'] = df_book['position_tag'].apply(compute_tag_priority)
    df_book = df_book.rename(columns={
                                      'internal_underlyingTicker': 'ticker',
                                      'position_tag': 'tag',
                                      'snapshot_date': 'srcDate'
                                      })


    df = pd.concat( [df, df_bbgPort, df_book] )
    df = df.sort_values( ['ticker', 'tag_priority'], ascending=[True, False] )
    df = df.drop_duplicates(subset=['ticker'], keep='first')



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
