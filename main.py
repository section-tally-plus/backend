import get_csv as gc

# Active and Future Terms
SPRING_22 = "202220"
SUMMER_22 = "202230"
FAll_22 = "202240"
ERROR = "202340"

current_terms = [SPRING_22, SUMMER_22, FAll_22, ERROR]

for term in current_terms:
    gc.get_csv(term)
