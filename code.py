# コマンド引数に期末試験のhtmlファイル、履修情報のcsvファイルを取る。

from bs4 import BeautifulSoup

# コマンド引数をとる。
import sys
path1 = sys.argv[1]
path2 = sys.argv[2]

# コマンド引数で指定されたhtml文書をsoupオブジェクトにする。
with open(path1)as f:
    text = f.read()
soup = BeautifulSoup(text, 'html.parser')

# 文書内のtrタグを検索する。1つのtr要素が表の1行に対応する。
trs = soup.find_all('tr')

# 授業の情報を記録した配列の配列kamokus
kamokus = []
for tr in trs:
    # 例外行の除外
    isbreak = False
    if tr.contents[0].text == "日付Date":
        isbreak = True
    if len(tr.contents) == 1:
        isbreak = True
    
    # kamokusの1要素配列kamoku
    if isbreak:
        isbreak = False
    else:
        kamoku = []
        tds = tr.contents
        for i in range(len(tds)): 
            td = tds[i]
            if i == 1 or i == 4: 
                kamoku.append(td.contents[0].text)
            else:
                kamoku.append(td.text)    
        kamokus.append(kamoku)

# 試験場所が空白（セルの結合含む）の場合、上のセルの情報をコピーする
for i in range(len(kamokus)):
    if len(kamokus[i]) == 6:
        kamokus[i].append(kamokus[i-1][6])

# 以下検索し出力する。

import csv
with open(path2) as f:
    kamokus2 = list(csv.reader(f))
    del kamokus2[0]

kamoku_numbers = []
for row in kamokus2:
    kamoku_numbers.append(row[2])

def search(number, kamoku_numbers):
    iskamoku = False
    for kamoku in kamoku_numbers:
        if kamoku == number:
            iskamoku = True
    return(iskamoku)

schedule = []
for row in kamokus:
    if search(row[3], kamoku_numbers):
        schedule.append(row)

with open('test.csv','w') as f:
    writer = csv.writer(f)
    writer.writerow(["日付","区分","時限","科目コード","科目名","担当教員","講義室"])
    writer.writerows(schedule)



