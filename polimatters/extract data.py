import csv
import json

wallisId = "600059"
wallis = "wallis"
oldenburgId = "4830"
oldenburg = "oldenburg"
aubreyId = "400011"
aubrey = "aubrey"
listerId = "13473"
lister = "lister"

hartlib = "justel"  ##xxxxx"  #""hartlib"
hartlibId = "12405"  #""300446"

huygens = "huygens"
huygensId = "11763"



filterSingulars = False

people_ids = [wallisId, oldenburgId, aubreyId, listerId, hartlibId, huygensId]
people_match = []

csvfile = open("OLDENBURG_AUBREY_WALLIS_LISTER-works.csv")
reader = csv.DictReader(csvfile)

authorCount = 0
recipientCount = 0
peopleWithIds = {}
for row in reader:

	authorId = row["Author EMLO ID"]
	recipientId = row["Recipient EMLO ID"]

	authorMatch = authorId in people_ids
	recipientMatch = recipientId in people_ids

	if (authorMatch and recipientMatch) or not (authorMatch or recipientMatch):
		# Ignore links between these key people, or those not involved at all
		continue


	if authorMatch:
		if recipientId not in peopleWithIds:
			peopleWithIds[recipientId] = {
				"keyword" : row["Recipient"].replace("(","").replace(")","") or "unknown name",
				oldenburg : 0,
				wallis : 0,
				aubrey : 0,
				lister : 0,
				huygens : 0,
				hartlib : 0
			}

		if authorId == wallisId :
			peopleWithIds[recipientId][wallis] += 1
		if authorId == oldenburgId :
			peopleWithIds[recipientId][oldenburg] += 1
		if authorId == aubreyId :
			peopleWithIds[recipientId][aubrey] += 1
		if authorId == listerId :
			peopleWithIds[recipientId][lister] += 1
		if authorId == hartlibId :
			peopleWithIds[recipientId][hartlib] += 1
		if authorId == huygensId :
			peopleWithIds[recipientId][huygens] += 1

		authorCount += 1
	else: # recipientMatch

		if authorId not in peopleWithIds:
			peopleWithIds[authorId] = {
				"keyword" : row["Author"].replace("(","").replace(")","") or "unknown name",
				oldenburg : 0,
				wallis : 0,
				aubrey : 0,
				lister: 0,
				huygens : 0,
				hartlib : 0
			}

		if recipientId == wallisId :
			peopleWithIds[authorId][wallis] += 1
		if recipientId == oldenburgId :
			peopleWithIds[authorId][oldenburg] += 1
		if recipientId == aubreyId :
			peopleWithIds[authorId][aubrey] += 1
		if recipientId == listerId :
			peopleWithIds[authorId][lister] += 1
		if recipientId == huygensId :
			peopleWithIds[authorId][huygens] += 1
		if recipientId == hartlibId :
			peopleWithIds[authorId][hartlib] += 1

		recipientCount += 1

csvfile.close()

people=[]
for personid in peopleWithIds:


	if True or not filterSingulars or \
		(
			peopleWithIds[personid][wallis] != 0 and peopleWithIds[personid][oldenburg] != 0 or
			peopleWithIds[personid][wallis] != 0 and peopleWithIds[personid][aubrey] != 0 or
			peopleWithIds[personid][aubrey] != 0 and peopleWithIds[personid][oldenburg] != 0
		) :

		peopleWithIds[personid]["tot"] = peopleWithIds[personid][wallis] + \
		                                 peopleWithIds[personid][oldenburg] + \
		                                 peopleWithIds[personid][aubrey] + \
		                                 peopleWithIds[personid][huygens] + \
		                                 peopleWithIds[personid][hartlib] + \
		                                 peopleWithIds[personid][lister]
		people.append( peopleWithIds[personid] )

#print "Author Count", authorCount
#print "Recipient Count", recipientCount

print json.dumps(people)

