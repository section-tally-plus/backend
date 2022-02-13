from bs4 import BeautifulSoup
import json
import requests
import time


def get_cell(cell):
    return cell.find("data").text if cell.find("data") else cell.find("ss:data").text


def get_headers(row):
    # return [cell.find("data").text if cell.find("data") else cell.find("ss:data").text for cell in row.find_all("cell")]
    return [get_cell(cell) for cell in row.find_all("cell")]


def get_row(row, headers):

    this_row = {}

    cells = row.find_all("cell")
    for i in range(0, len(cells)):
        this_row[headers[i]] = cells[i].find("data").text if cells[i].find("data") else cells[i].find("ss:data").text

    return this_row


def get_data(
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

    print(f"Getting data for term {term}")
    start_time = time.time()

    url = f"https://banner.rowan.edu/reports/reports.pl?term={term}&task=Section_Tally&coll={coll}&dept={dept}&subj={subj}&ptrm={ptrm}&sess={sess}&prof={prof}&attr={attr}&camp={camp}&bldg={bldg}&Search=Search&format=excel"
    response = requests.get(url)

    print(f"request finished in {time.time() - start_time} seconds")

    file = BeautifulSoup(response.text, "lxml")
    rows = file.find("workbook").find("worksheet").find("table").find_all("row")

    # The headers of the spreadsheet are the first row.
    # Get the headers, and create a dataframe with those column headers
    headers = get_headers(rows[0])
    json_obj = {"classes": []}

    for row in rows[1:]:
        json_obj["classes"].append(get_row(row, headers))

    with open(f"{path}section_tally_{term}.json", "w") as outfile:
        json.dump(json_obj, outfile)

    end_time = time.time()

    print(f"term {term} finished in: {end_time - start_time} seconds")
