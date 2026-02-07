from flask import Flask, render_template, jsonify, request
import random
import time
import datetime

app = Flask(__name__)

# Mock Database for Logs
system_logs = []

def add_log(event):
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    system_logs.append(f"[{timestamp}] {event}")

@app.route('/')
def home():
    add_log("System Booted: All sensors online.")
    return render_template('index.html')

@app.route('/process_ai', methods=['POST'])
def process_ai():
    data = request.json
    trigger_type = data.get('type', 'Manual')
    location = data.get('location', 'Unknown')
    
    # Advanced ML Simulation Logic
    # Analyzing Time, Location, and Audio Frequency
    risk_score = random.randint(85, 99) if trigger_type != 'Manual' else random.randint(30, 99)
    
    status = "CRITICAL" if risk_score > 75 else "STABLE"
    
    response_data = {
        "status": status,
        "risk_score": risk_score,
        "threat_analysis": f"Threat Level: {status} | Pattern: {trigger_type}",
        "automated_actions": [
            "Loud Siren: 120dB Activated",
            "Emergency SMS: Dispatched to Contacts",
            "Police HQ: Live Stream Established",
            "Auto-Call: Dialing Emergency Services",
            "GPS Stealth: Tracking Active"
        ],
        "timestamp": datetime.datetime.now().strftime("%H:%M:%S")
    }
    return jsonify(response_data)

@app.route('/get_nearby_police', methods=['GET'])
def get_police():
    # Simulated Police Station Locator
    stations = [
        {"name": "Central Police HQ", "dist": "0.8km", "status": "Active"},
        {"name": "City Patrol Station", "dist": "1.5km", "status": "Busy"},
        {"name": "Emergency Response Unit", "dist": "2.2km", "status": "Active"}
    ]
    return jsonify(stations)

if __name__ == '__main__':
    app.run(debug=True, port=5000)