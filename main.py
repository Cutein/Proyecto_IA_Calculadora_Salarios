from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import wordnet

nltk.data.path.append("C:\\Users\\Joanne\\AppData\\Roaming\\nltk_data")
#nltk.download('punkt')
#nltk.download('wordnet')

def load_results_public():
    df = pd.read_csv('salarios.csv', usecols=['ResponseId','MainBranch','Age','Employment','RemoteWork','EdLevel','YearsCode','YearsCodePro','Country','Currency','CompTotal','LanguageHaveWorkedWith'])
    df.columns = ['id','Profesion','Edad','Tipo_Empleo','Modalidad_Trabajo','Nivel_Educacion','Años_Codificando','Años_Experiencia_Laboral','Pais','Moneda','Salario_Total','Lenguajes_Maneja']
    
    # Convertir 'Salario_Total' a float, reemplazando errores con NaN y luego con 0 si es necesario
    df['Salario_Total'] = pd.to_numeric(df['Salario_Total'], errors='coerce').fillna(0)
    df = df.head(1000)
    return df.fillna('').to_dict(orient='records')

list_results = load_results_public()

def get_synonyms(word):
    return {lemma.name().lower() for synset in wordnet.synsets(word) for lemma in synset.lemmas()}

app = FastAPI(title="Calculadora de Proyectos para Desarrolladores", version="1.0.0")

# Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", tags="Home")

def home():
    return FileResponse("static/index.html")

@app.get("/salarios", tags="Salarios")

def get_salarios():
    return list_results or HTTPException(status_code=500, detail="No se encontraron resultados de Salarios.") 

@app.get("/salarios/{salario}", tags="Salarios")

def get_salario(total: float):
    return next((salario for salario in list_results if salario['Salario_Total'] >= total), {"Detalle: Salario no encontrado"})

@app.get("/chatbot", tags=["Chatbot"])
def chatbot(query: str):
    query_words = word_tokenize(query.lower())
    sinonimos = {word for q in query_words for word in get_synonyms(q)} | set (query_words)
    
    result = [m for m in list_results if any(word in m['Lenguajes_Maneja'].lower() for word in sinonimos)]
    
    return JSONResponse(content={
        "resultados": "Resultados De salarios Encontrados: "
        if result
        else "No se encontraron resultados de Salarios.",
        "salarios": result
    })
    
@app.get("/experiencia", tags=["Experiencia"])
def get_salarys_by_experience(experience: int):
    return [
        salario for salario in list_results
        if salario['Años_Experiencia_Laboral'].isdigit() and int(salario['Años_Experiencia_Laboral']) <= experience
    ]
