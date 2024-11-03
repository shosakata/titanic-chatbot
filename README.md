## Titanic Chatbot (Sho's Chatbot)
In addition to regular chat functionality, this chatbot can handle questions related to CSV files and the Titanic dataset.

### Demo
You can try the titanic-chatbot [here](https://shochatbot.com/).

### LLM Capabilities

![Screenshot 2024-11-02 172729](https://github.com/user-attachments/assets/d131f1d9-ba18-415b-8a45-811c003e5be8)

The chatbot provides three main Question Answering functionalities:
- Answering general text-based questions.
- Answering questions based on an uploaded CSV file.
- Accessing a Database (Titanic Dataset) to answer related questions.

### Languages Used
![HTML](https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## How to use

### Setup Environment (Optional)
```bash
sudo apt update
sudo apt install -y python3-pip
sudo apt install python3-venv
python3 -m venv myenv
```

### Install Python Libraries
```
pip install -r requirements.txt
```
### Setup PostgreSQL
Install PostgreSQL with the following commands:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

After installing PostgreSQL, access it and set a password:
```
sudo -i -u postgres
psql
ALTER USER postgres PASSWORD 'postgres';
```

Install the following Python libraries to import the Titanic dataset into PostgreSQL:
```
pip install psycopg2
pip install SQLAlchemy
```

 
Once you obtain the Titanic dataset from [Kaggle](https://www.kaggle.com/datasets/yasserh/titanic-dataset), use the following Python code to load it into PostgreSQL:
```python
from sqlalchemy import create_engine 

database = "postgres"
user = "postgres"
password = "postgres"
host = "localhost"

conn_string = f"postgresql+psycopg2://{user}:{password}@{host}/{database}"
db = create_engine(conn_string)
conn = db.connect() 

data = pd.read_csv("Titanic-Dataset.csv") 
data.columns = [i.lower() for i in data.columns]
data.to_sql('titanic', conn, if_exists='replace', index=False) 
```
### Launch the Application
The following Python code will run app.py and launch the application
```
python app.py
```
