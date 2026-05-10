from flask import Flask, jsonify
import requests
import os
from datetime import datetime

app = Flask(__name__)

# Coordenadas de Satubinha (aproximadas, usando São Paulo como base)
LATITUDE = -23.5505
LONGITUDE = -46.6333
CITY_NAME = "Satubinha"

# OpenWeatherMap API
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "demo_key")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast"

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "weather"})

@app.route("/api/weather", methods=["GET"])
def get_weather():
    """Retorna previsão do tempo para a semana em Satubinha"""
    
    # Se API_KEY é demo, retorna dados mockados
    if OPENWEATHER_API_KEY == "demo_key":
        return get_mock_weather()
    
    try:
        params = {
            "lat": LATITUDE,
            "lon": LONGITUDE,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric",
            "lang": "pt_br"
        }
        
        response = requests.get(OPENWEATHER_BASE_URL, params=params, timeout=5)
        response.raise_for_status()
        
        data = response.json()
        
        # Processar previsão para os próximos 5 dias
        forecast = process_forecast(data["list"])
        
        return jsonify({
            "city": CITY_NAME,
            "lat": LATITUDE,
            "lon": LONGITUDE,
            "forecast": forecast,
            "timestamp": datetime.now().isoformat()
        })
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

def process_forecast(data_list):
    """Processa lista de previsões e agrupa por dia"""
    forecast_by_day = {}
    
    for item in data_list:
        # Pega apenas a previsão das 12:00 (meio do dia) para cada dia
        dt = datetime.fromtimestamp(item["dt"])
        day_key = dt.strftime("%Y-%m-%d")
        
        if day_key not in forecast_by_day and dt.hour == 12:
            forecast_by_day[day_key] = {
                "date": day_key,
                "day_name": dt.strftime("%A"),
                "temp_max": item["main"]["temp_max"],
                "temp_min": item["main"]["temp_min"],
                "description": item["weather"][0]["description"],
                "icon": item["weather"][0]["icon"],
                "humidity": item["main"]["humidity"],
                "wind_speed": item["wind"]["speed"]
            }
    
    # Retorna apenas os primeiros 5 dias
    return list(forecast_by_day.values())[:5]

def get_mock_weather():
    """Retorna dados fictícios de previsão (para demonstração)"""
    return jsonify({
        "city": CITY_NAME,
        "lat": LATITUDE,
        "lon": LONGITUDE,
        "forecast": [
            {
                "date": "2026-05-10",
                "day_name": "Saturday",
                "temp_max": 28,
                "temp_min": 22,
                "description": "Céu limpo",
                "icon": "01d",
                "humidity": 60,
                "wind_speed": 5.5
            },
            {
                "date": "2026-05-11",
                "day_name": "Sunday",
                "temp_max": 27,
                "temp_min": 21,
                "description": "Parcialmente nublado",
                "icon": "02d",
                "humidity": 65,
                "wind_speed": 6.0
            },
            {
                "date": "2026-05-12",
                "day_name": "Monday",
                "temp_max": 26,
                "temp_min": 20,
                "description": "Chuva leve",
                "icon": "09d",
                "humidity": 80,
                "wind_speed": 7.5
            },
            {
                "date": "2026-05-13",
                "day_name": "Tuesday",
                "temp_max": 25,
                "temp_min": 19,
                "description": "Nublado",
                "icon": "04d",
                "humidity": 75,
                "wind_speed": 6.5
            },
            {
                "date": "2026-05-14",
                "day_name": "Wednesday",
                "temp_max": 29,
                "temp_min": 23,
                "description": "Céu limpo",
                "icon": "01d",
                "humidity": 55,
                "wind_speed": 4.5
            }
        ],
        "timestamp": datetime.now().isoformat()
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
