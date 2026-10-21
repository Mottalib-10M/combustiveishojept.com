#!/usr/bin/env python3
"""Relit les sources officielles et régénère les JSON de src/data/ (lancé chaque jour par le workflow).

Sources (conditions lues le 2026-10-21, détail dans CONTRIBUTING-DONNEES.md) :
  1. DGEG, portail Preços dos Combustíveis Online : API JSON publique du portail
     https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/…
     - PesquisarPostos : prix affiché par poste, un appel par combustible (≈ 3 000 postes du continent)
     - PMD             : prix moyen journalier national par combustible
     - GetMunicipios   : les 278 concelhos du continent et leur district
     « A informação disponível neste sítio é gratuita, podendo ser utilizada livremente » ; réutilisation
     en citant la DGEG, la date-heure de la dernière mise à jour et en reproduisant fidèlement les prix.
  2. ENSE, Preços de Referência : export du formulaire public (CSV « ; »)
     POST https://www.ense-epe.pt/precos-de-referencia/?action=xls  dataInicio=JJ/MM/AAAA dataFim=… fueltype=1|2|5
     ENSE, Decomposição : valeurs du graphique de https://www.ense-epe.pt/decomposicao/
  3. JORAM (Madeira), II série : Despacho Conjunto « Homologação dos preços máximos de venda ao público dos
     combustíveis », un par semaine, PDF publics de https://joram.madeira.gov.pt/joram/2serie/Ano%20de%20AAAA/

Usage : python3 scripts/update-data.py [--hoje AAAA-MM-DD] [--sem-madeira]
Un échec d'une source laisse son fichier précédent intact (le site garde la dernière donnée, datée).
"""
import csv, datetime as dt, io, json, os, re, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src', 'data')
UA = {'User-Agent': 'Mozilla/5.0 (compatible; combustiveis-hoje-dados/1.0; +dados abertos DGEG/ENSE)'}
DGEG = 'https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb'
# Combustíveis retidos : clé courte du site → identifiant DGEG
FUEIS = {'gs': 2101, 'ge': 2105, 'g95': 3201, 'g95e': 3205, 'g98': 3400, 'gpl': 1120}
DESDE = '2023-01-01'

def get(url, data=None, tries=3, timeout=120):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, data=data, headers=UA)
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except Exception as e:  # réseau instable : on réessaie
            if i == tries - 1:
                raise
            time.sleep(5 * (i + 1))

def jget(path, **params):
    q = urllib.parse.urlencode(params)
    d = json.loads(get(f'{DGEG}/{path}?{q}'))
    if not d.get('status'):
        raise RuntimeError(f'DGEG {path}: {d.get("mensagem")}')
    return d['resultado']

def eur(s):
    """« 2,176 € » → 2.176"""
    return float(str(s).replace('€', '').replace(',', '.').strip())

def write(name, obj):
    p = os.path.join(DATA, name)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))
    print(f'  {name}: {os.path.getsize(p) // 1024} Ko')

def lisbon_now():
    # Portugal continental : UTC+1 de fin mars à fin octobre, UTC sinon (règle de l'UE)
    now = dt.datetime.now(dt.timezone.utc)
    y = now.year
    last_sun = lambda m: max(d for d in (dt.date(y, m, 31) - dt.timedelta(k) for k in range(7)) if d.weekday() == 6)
    start = dt.datetime.combine(last_sun(3), dt.time(1), dt.timezone.utc)
    end = dt.datetime.combine(last_sun(10), dt.time(1), dt.timezone.utc)
    return now + dt.timedelta(hours=1 if start <= now < end else 0)

def dgeg(hoje):
    print('DGEG…')
    munis = jget('GetMunicipios')
    concelhos = sorted({(m['Distrito']['Descritivo'], m['Descritivo']) for m in munis})
    postos = {}
    for k, fid in FUEIS.items():
        res = jget('PesquisarPostos', idsTiposComb=fid, idMarca='', idTipoPosto='', idDistrito='', idsMunicipios='', qtdPorPagina=6000, pagina=1)
        for x in res:
            p = postos.setdefault(x['Id'], {'id': x['Id'], 'n': x['Nome'].strip(), 'm': (x['Marca'] or '').strip(), 't': x['TipoPosto'],
                                             'd': x['Distrito'], 'c': x['Municipio'], 'l': (x['Localidade'] or '').strip(), 'p': {}})
            p['p'][k] = [eur(x['Preco']), x['DataAtualizacao']]
        print(f'  {k}: {len(res)} postos')
    lista = sorted(postos.values(), key=lambda p: (p['d'], p['c'], p['n']))
    ultima = max(v[1] for p in lista for v in p['p'].values())
    write('postos.json', {'lido': lisbon_now().strftime('%Y-%m-%d %H:%M'), 'ultimaAtualizacao': ultima,
                          'concelhos': [list(c) for c in concelhos], 'postos': lista})

    res = jget('PMD', idsTiposComb=','.join(str(v) for v in FUEIS.values()), dataIni=DESDE, dataFim=hoje, qtdPorPagina=20000, pagina=1, orderDesc=1)
    nome2k = {}
    for t in jget('GetTiposCombustiveis'):
        for k, fid in FUEIS.items():
            if t['Id'] == fid:
                nome2k[t['Descritivo']] = k
    dias = {}
    for x in res:
        k = nome2k.get(x['TipoCombustivel'])
        if not k:
            continue
        dias.setdefault(x['Data'], {})[k] = [eur(x['PrecoMedio']), eur(x['PrecoMin']), eur(x['PrecoMax']), x['NumPostos'], eur(x['PrecoMedioSDesc'])]
    write('pmd.json', {'lido': lisbon_now().strftime('%Y-%m-%d %H:%M'), 'dias': dict(sorted(dias.items()))})

def ense(hoje):
    print('ENSE…')
    ini = dt.date.fromisoformat(DESDE).strftime('%d/%m/%Y')
    fim = dt.date.fromisoformat(hoje).strftime('%d/%m/%Y')
    ref = {}
    for nome, ft in (('gasolina', 1), ('gasoleo', 2), ('gpl', 5)):
        raw = get('https://www.ense-epe.pt/precos-de-referencia/?action=xls',
                  data=urllib.parse.urlencode({'dataInicio': ini, 'dataFim': fim, 'fueltype': ft}).encode()).decode('utf-8-sig')
        if not raw.startswith('DATA;'):
            raise RuntimeError(f'ENSE {nome}: format inattendu')
        serie = {}
        for row in list(csv.reader(io.StringIO(raw), delimiter=';'))[1:]:
            if len(row) < 2 or not row[1].strip():
                continue
            d = dt.datetime.strptime(row[0], '%d/%m/%Y').date().isoformat()
            serie[d] = float(row[1].replace(',', '.'))
        ref[nome] = dict(sorted(serie.items()))
        print(f'  {nome}: {len(serie)} dias')
    page = get('https://www.ense-epe.pt/decomposicao/').decode('utf-8', 'ignore')
    labels = re.search(r"const labels = \[(.*?)\];", page, re.S)
    lab = re.findall(r"'([^']+)'", labels.group(1)) if labels else []
    decomp = {}
    for nome, var in (('gasolina', 'gasolina_dec'), ('gasoleo', 'gasoleo_dec'), ('gpl', 'auto_dec')):
        m = re.search(var + r" = \{.*?Preço: ([\d,]+) €.*?data: \[(.*?)\]", page, re.S)
        if not m:
            raise RuntimeError(f'ENSE decomposição {nome} introuvable')
        vals = [float(v) for v in re.findall(r'-?\d+\.\d+', m.group(2))]
        decomp[nome] = {'preco': float(m.group(1).replace(',', '.')), 'partes': vals}
    write('ense.json', {'lido': lisbon_now().strftime('%Y-%m-%d %H:%M'), 'ref': ref,
                        'decomp': {'labels': lab, **decomp}})

def madeira(hoje):
    """Derniers Despachos Conjuntos de prix maximums (Madeira). Les PDF déjà lus sont gardés dans le JSON."""
    print('JORAM…')
    try:
        import pypdf
    except ImportError:
        print('  pypdf absent : pip install pypdf (Madeira inchangée)')
        return
    p = os.path.join(DATA, 'madeira.json')
    old = json.load(open(p, encoding='utf-8')) if os.path.exists(p) else {'despachos': [], 'vistos': []}
    vistos = set(old.get('vistos', []))
    desp = {d['vigor']: d for d in old.get('despachos', [])}
    ano = int(hoje[:4])
    for y in (ano - 1, ano):
        base = f'https://joram.madeira.gov.pt/joram/2serie/Ano%20de%20{y}/'
        try:
            idx = get(base).decode('utf-8', 'ignore')
        except Exception as e:
            print('  index', y, e)
            continue
        fich = sorted(set(re.findall(r'IISerie-\d+-\d{4}-\d\d-\d\d[^"/]*?\.pdf', idx)))
        lim = (dt.date.fromisoformat(hoje) - dt.timedelta(days=120)).isoformat()
        fich = [f for f in fich if re.search(r'\d{4}-\d\d-\d\d', f).group(0) >= lim]
        for f in fich:
            if f in vistos:
                continue
            try:
                r = pypdf.PdfReader(io.BytesIO(get(base + f)))
                txt = '\n'.join((pg.extract_text() or '') for pg in r.pages)
            except Exception as e:
                print('  ', f, e)
                continue
            vistos.add(f)
            for m in re.finditer(r'Despacho Conjunto n\.º\s*(\d+/\d{4}).{0,400}?Homologação dos preços máximos.*?a partir das 0 horas do dia (\d+) de (\w+) de (\d{4})(.*?)Assinado', txt, re.S):
                meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
                vig = dt.date(int(m.group(4)), meses.index(m.group(3).lower()) + 1, int(m.group(2))).isoformat()
                corpo = m.group(5)
                def pr(rx):
                    mm = re.search(rx + r'[ .…]*([\d],\d{3})\s*€', corpo, re.S)
                    return float(mm.group(1).replace(',', '.')) if mm else None
                d = {'vigor': vig, 'despacho': m.group(1), 'g95': pr(r'Gasolina super sem chumbo IO\s*95'), 'gs': pr(r'Gasóleo rodoviário'),
                     'colorido': pr(r'Gasóleo colorido e marcado'), 'url': base + f}
                if d['g95'] and d['gs']:
                    desp[vig] = d
                    print('  ', vig, d['despacho'], d['g95'], d['gs'])
    lista = sorted(desp.values(), key=lambda d: d['vigor'])[-26:]
    write('madeira.json', {'lido': lisbon_now().strftime('%Y-%m-%d %H:%M'), 'despachos': lista, 'vistos': sorted(vistos)[-400:]})

def main():
    a = sys.argv[1:]
    hoje = a[a.index('--hoje') + 1] if '--hoje' in a else lisbon_now().date().isoformat()
    erros = []
    for nome, fn in (('dgeg', dgeg), ('ense', ense), ('madeira', madeira)):
        if nome == 'madeira' and '--sem-madeira' in a:
            continue
        try:
            fn(hoje)
        except Exception as e:
            erros.append(f'{nome}: {e}')
            print('ERRO', nome, e)
    est = {'gerado': lisbon_now().strftime('%Y-%m-%d %H:%M'), 'hoje': hoje, 'erros': erros}
    write('estado.json', est)
    sys.exit(1 if len(erros) == 3 else 0)

if __name__ == '__main__':
    main()
