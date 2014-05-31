# This file will take csvs (generated from peace corps' excel files) and clean the data to use in socrata
__author__ = 'nmew'
import numpy as np
import csv


def main():
    jsrPath = 'data/JSR_Full_Extract_2014_0501.tsv'
    fixJsrDates(jsrPath)
    # medPath = 'data/Med.tsv'
    # generateUniqueMedicaIssuesCSV(medPath)


def fixJsrDates(path):
    jsr = np.genfromtxt(path, dtype='str', delimiter='\t', filling_values='')
    # date cols
    invitationDeadline = 'Invitation Deadline'
    invitationDeadlineColNum = 0
    stagingStartdate = 'Staging Start Date'
    stagingStartdateColNum = 0
    # get column numbers
    for index, coltext in enumerate(jsr[0]):
        if invitationDeadline in coltext:
            invitationDeadlineColNum = index
        if stagingStartdate in coltext:
            stagingStartdateColNum = index

    #loop through rows, fix dates
    for row in jsr:
        row[invitationDeadlineColNum] = fixDate(row[invitationDeadlineColNum])
        row[stagingStartdateColNum] = fixDate(row[stagingStartdateColNum])

    with open('fixedJSR.tsv', 'wb') as csvfile:
        csvwriter = csv.writer(csvfile, delimiter='\t')
        csvwriter.writerows(jsr)


def fixDate(datestr):
    # str comes in as d-Mon-YY return MMM d, yy
    splitdate = datestr.split('-')
    return splitdate[1] + ' ' + splitdate[0] + ', ' + splitdate[2]


def generateUniqueMedicaIssuesCSV(path):
    med = np.genfromtxt(path, dtype='str', delimiter='\t', skip_header=1, filling_values='')

    countries = med[:, 0]
    descriptions = med[:, 1]

    uniqueContries = set()
    uniqueMedicalIssues = set()

    for country in countries:
        uniqueContries.add(country)

    for description in descriptions:
        medicalIssues = description.replace(":", ";").split(';')
        for index, issue in enumerate(medicalIssues):
            if index > 0:
                uniqueMedicalIssues.add(issue)

    with open('countries.csv', 'wb') as csvfile:
        csvwriter = csv.writer(csvfile)
        for country in uniqueContries:
            csvwriter.writerow([country])

    with open('medicalIssues.csv', 'wb') as csvfile:
        csvwriter = csv.writer(csvfile)
        for issue in uniqueMedicalIssues:
            csvwriter.writerow([issue])


if __name__ == "__main__":
        main()