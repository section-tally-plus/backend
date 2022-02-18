import get_csv as gc
import get_json as gj

# Active and Future Terms

terms = {
    "SPRING_22": "202220",
    "SUMMER_22": "202230",
    "FAll_22": "202240",
}

extra_fields = {
    "colleges": {
        "No College": "NC",
        "Honors College": "HC",
        "Schl of Nursing & Health Prof": "HP",
        "Grad Schl Biomedical Sci-Strat": "GS",
        "Cooper Medical School of Rowan": "MS",
        "College of Hum. & Soc. Sci.": "HS",
        "School of Professional Studies": "PS",
        "School of Earth & Environment": "EE",
        "College of Performing Arts": "PA",
        "College of Sci & Math": "SC",
        "College of Engineering": "EN",
        "College of Business": "BA",
        "College of Education": "ED",
        "College of Com. & Creative Art": "CC",
        "School of Osteopathic Medicine": "OM",
    },
    "departments": {},
    "attributes": {},
}


for term in terms:
    gj.get_data(terms[term])
    for field in extra_fields:
        if extra_fields[field] != {}:
            for item in extra_fields[field]:
                print(item, extra_fields[field][item])
        else:
            print(f"{field} is empty")
