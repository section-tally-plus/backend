""" Retrieves data from section tally in the form of an excel file. 
    The file is then parsed and converted to a csv which is then uploaded to the database.
    The CSV and excel file are then deleted.
"""

import pandas as pd
import time
from bs4 import BeautifulSoup
import requests


# Terms years are based on the year in which the term ends. (really only applicable to the winter term)
# Past Terms
# !check this
# WINTER_22 = "202210"

# Active and Future Terms
SPRING_22 = "202220"
SUMMER_22 = "202230"
FAll_22 = "202240"

current_terms = [SPRING_22, SUMMER_22, FAll_22]

print("Start")
start_time = time.time()

for term in current_terms:
    csv_filename = "data/section_tally_" + term + ".csv"
    URL = (
        "https://banner.rowan.edu/reports/reports.pl?term="
        + term
        + "&task=Section_Tally&coll=ALL&dept=ALL&subj=ALL&ptrm=ALL&sess=ALL&prof=ALL&attr=ALL&camp=ALL&bldg=ALL&Search=Search&format=excel"
    )

    cols = [
        "CRN",
        "Subj",
        "Crse",
        "Sect",
        "PartofTerm",
        "Session",
        "Title",
        "Prof",
        "Metting",
        "Campus",
        "AddlInfo",
        "Hrs",
        "Max",
        "MaxResv",
        "LeftResv",
        "Enr",
        "Avail",
        "WaitCap",
        "WaitCount",
        "WaitAvail",
        "RoomCap",
    ]
    csv_rows = []

    url_link = requests.get(URL)

    file = BeautifulSoup(url_link.text, "lxml")
    # file = file.encode(formatter="html")

    xml_rows = file.find("workbook").find("worksheet").find("table").find_all("row")

    for row in xml_rows:
        this_row = {}
        data = []

        cells = row.find_all("cell")

        for cell in cells:
            text = cell.find("data").text if cell.find("data") else cell.find("ss:data").text
            text = text.replace("\n", ":::")
            data.append(text)

        for col in cols:
            this_row[col] = data[cols.index(col)]

        csv_rows.append(this_row)

    df = pd.DataFrame(csv_rows, columns=cols)
    df.to_csv(csv_filename, encoding="utf-8")

end_time = time.time()
print("End")
print("Time taken: " + str(end_time - start_time))
