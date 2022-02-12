import pandas as pd
import time

from bs4 import BeautifulSoup
import requests


def get_row(row):
    return [cell.find("data").text if cell.find("data") else cell.find("ss:data").text for cell in row.find_all("cell")]


def get_csv(
    term,
    path="",
    coll="ALL",
    dept="ALL",
    subj="ALL",
    ptrm="ALL",
    sess="ALL",
    prof="ALL",
    attr="ALL",
    camp="ALL",
    bldg="ALL",
) -> None:

    start_time = time.time()

    url = f"https://banner.rowan.edu/reports/reports.pl?term={term}&task=Section_Tally&coll={coll}&dept={dept}&subj={subj}&ptrm={ptrm}&sess={sess}&prof={prof}&attr={attr}&camp={camp}&bldg={bldg}&Search=Search&format=excel"
    response = requests.get(url)
    file = BeautifulSoup(response.text, "lxml")
    rows = file.find("workbook").find("worksheet").find("table").find_all("row")

    # The headers of the spreadsheet are the first row.
    # Get the headers, and create a dataframe with those column headers
    headers = get_row(rows[0])
    df = pd.DataFrame(columns=headers)

    # Append each row in the XML document to the dataframe
    for row in rows[1:]:
        df.loc[len(df.index)] = get_row(row)

    df.to_csv(f"{path}section_tally_{term}.csv", encoding="utf-8", index=False)

    end_time = time.time()
    print(f"term {term} finished in: {end_time - start_time} seconds")
