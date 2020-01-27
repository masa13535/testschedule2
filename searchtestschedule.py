'''
このプログラムはテスト時間割から申告科目を探すプログラムである。時間割のhtmlファイルの相対パスをコマンド引数としてとり、それを整理したデータをCSVとして出力する。なお、形式に強く依存しているため、形式が変更された場合には修正が必要である。
'''
from bs4 import BeautifulSoup

# コマンド引数をとる。
import sys
path = sys.argv[1]

# コマンド引数で指定されたhtml文書をsoupオブジェクトにする。
with open(path)as f:
    text = f.read()
soup = BeautifulSoup(text, 'html.parser')

# 文書内のtrタグを検索する。1つのtr要素が表の1行に対応する。
trs = soup.find_all('tr')

# 授業の情報を記録した配列の配列kamokus
kamokus = []
for tr in trs:
    '''
    classやstyleを除いたあるtrのサンプル
    <tr>
	<td><p>28(<span>火</span>)</p></td>
	<td><p>授業</p><p>classes</p></td>
	<td><p>1-2</p></td>
	<td><p>ARC.P305</p></td>
	<td><p>国土・都市計画論</p><p>National and City Planning</p></td>
	<td><p>中井 検裕,十代田 朗</p><p>Nakai Norihiro,Soshiroda Akira</p></td>
	<td><p>W933</p></td>
    </tr>
    '''
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

for i in range(len(kamokus)):
    if len(kamokus[i]) == 6:
        kamokus[i].append(kamokus[i-1][6])


# CSV出力
import csv
with open('alltestschedule.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(["日付","区分","時限","科目コード","科目名","担当教員","講義室"])
    writer.writerows(kamokus)
