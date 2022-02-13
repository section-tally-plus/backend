import get_csv as gc
import get_json as gj

# Active and Future Terms
SPRING_22 = "202220"
SUMMER_22 = "202230"
FAll_22 = "202240"
ERROR = "202340"

current_terms = [SPRING_22, SUMMER_22, FAll_22]

for term in current_terms:
    gj.get_data(term)
# gc.get_csv(term)
