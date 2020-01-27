import sys
a = sys.argv
exam_path = a[1]
kamokus_path = a[2]

exam = []
kamokus = []

import csv
with open(exam_path) as f:
	exam = list(csv.reader(f))
	del exam[0]

with open(kamokus_path) as f:
	kamokus = list(csv.reader(f))
	del kamokus[0]

kamoku_numbers = []
for row in kamokus:
	kamoku_numbers.append(row[2])

def search(number, kamoku_numbers):
	iskamoku = False
	for kamoku in kamoku_numbers:
		if kamoku == number:
			iskamoku = True
	return(iskamoku)

schedule = []
for row in exam:
	if search(row[3], kamoku_numbers):
		schedule.append(row)

with open('schedule.csv','w') as f:
    writer = csv.writer(f)
    writer.writerow(["日付","区分","時限","科目コード","科目名","担当教員","講義室"])
    writer.writerows(schedule)
