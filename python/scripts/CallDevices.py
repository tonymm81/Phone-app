import sys
sys.path.append('broadlink')  # Lisää tämä rivi

import broadlink  # Nyt voit tuoda broadlink-kirjaston

def get_data():
    data = {
        "name": "John Doe",
        "age": 30,
        "city": "New York"
    }
    return data

if __name__ == "__main__":
    print(get_data())