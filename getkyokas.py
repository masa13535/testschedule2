'''
このプログラムは「東工大教務web-申告科目の参照-時間割から」のページから履修中の教科コードを抽出しリストとして返すプログラムである。コマンド引数に保存した教務webのページの相対パスを与えると、教科コードを探索し、標準出力に出力する。
'''
from bs4 import BeautifulSoup

import sys
path = sys.argv[1]

with open(path)as f:
    text = f.read()

soup = BeautifulSoup(text, 'html.parser')

kyoka_elms = soup.find_all('p', {'class':'ttSinkokuNo'})

kyokas = []
for s in kyoka_elms:
    kyokas.append(s.text)
    
for i in kyokas:
    print(i)
