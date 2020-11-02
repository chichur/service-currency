import json
import requests
from lxml import etree
from datetime import datetime
from flask import Flask, request

app = Flask(__name__)


@app.route('/api', methods=['GET', 'POST', 'OPTIONS'])
def api():
    if request.method == 'OPTIONS':
        resp = Flask.response_class()
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = '*'
        return resp
    # запрос списка валют
    if request.method == 'GET':
        resp = Flask.response_class()
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = '*'

        # формируем данные для формата JSON
        req = requests.get('http://www.cbr.ru/scripts/XML_valFull.asp')
        root = etree.fromstring(req.content)
        currencies = []
        for r in root:
            currencies.append({'name': r.getchildren()[0].text,
                               'code': r.getchildren()[5].text})

        # заносим данные в тело ответа
        resp.data = json.dumps(currencies)
        return resp
    if request.method == 'POST':
        resp = Flask.response_class()
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Headers'] = '*'
        # получаем данные
        data = request.json
        dt = datetime.strptime(data[1], '%Y-%m-%d')
        date1 = datetime.strftime(dt, '%d/%m/%Y')
        req1 = requests.get('http://www.cbr.ru/scripts/XML_daily.asp?date_req={0}'.format(date1))
        dt = datetime.strptime(data[2], '%Y-%m-%d')
        date2 = datetime.strftime(dt, '%d/%m/%Y')
        req2 = requests.get('http://www.cbr.ru/scripts/XML_daily.asp?date_req={0}'.format(date2))
        root1 = etree.fromstring(req1.content)
        root2 = etree.fromstring(req2.content)
        curr1, curr2 = 0, 0
        for r in root1:
            if str(r.getchildren()[1].text) == data[0]:
                curr1 = float(str(r.getchildren()[4].text).replace(',', '.'))
                break
        for r in root2:
            if str(r.getchildren()[1].text) == data[0]:
                curr2 = float(str(r.getchildren()[4].text).replace(',', '.'))
                break

        result = {
          'curr1': str(curr1) if curr1 != 0 else 'Курса нет',
          'curr2': str(curr2) if curr2 != 0 else 'Курса нет',
          'diff': '+' + str(round(curr2-curr1, 3)) if curr2-curr1 >= 0 else str(round(curr2-curr1, 3)),
          'raise': True if curr2-curr1 >= 0 else False
        }

        resp.data = json.dumps(result)
        return resp


if __name__ == '__main__':
    app.run()
