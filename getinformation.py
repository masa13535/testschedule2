'''
このプログラムは「東工大教務web-申告科目の参照-時間割から」のページから履修中の教科の名前、コード、開講時間、教員名を抽出し、その辞書のリストを作成するプログラムである。コマンド引数に保存した教務webのページの相対パスを与えると、探索し、標準出力に出力する。教務webの形式に強く依存しているので仕様変更で動かなくなる可能性が高い。
'''
from bs4 import BeautifulSoup
import csv

import sys
path = sys.argv[1]

with open(path)as f:
    text = f.read()

soup = BeautifulSoup(text, 'html.parser')

kamoku_cells = soup.find_all('div', {'class':'tdSinkoku2'})

kamokus = []
for i in kamoku_cells:
    mydict = {}
    mydict["name"] = i.contents[1].text
    mydict["code"] = i.contents[2].text
    mydict["youbi"] = i.contents[3].text
    mydict["kyoin"] = i.contents[5].text
    kamokus.append(mydict)
#print(kamokus)

with open('kamokus.csv','w') as f:
    writer = csv.writer(f)
    writer.writerow(["","科目名","科目コード","開講Q・時限・場所","教員名"])
    for i in range(len(kamokus)):
        kamoku = kamokus[i]
        writer.writerow([i+1,kamoku['name'],kamoku['code'],kamoku['youbi'],kamoku['kyoin']])
