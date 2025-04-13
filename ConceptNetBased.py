import requests
term = "dog"
r = requests.get(f"https://api.conceptnet.io/c/en/{term}")
data = r.json()
edges = data["edges"]
for edge in edges[:5]:
    print(edge["rel"]["label"], "->", edge["end"]["label"])
