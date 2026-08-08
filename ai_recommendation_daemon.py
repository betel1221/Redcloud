import time
import requests
import json
import psycopg2
from datetime import datetime

def get_recommendation_from_ai():
    url = "http://127.0.0.1:5678/webhook/erp-chat"
    payload = {
        "message": "Analyze database health, indexes, and query performance for YAMROT. Generate exactly one title, impact level (HIGH, MEDIUM, or LOW), and a short 1-sentence recommendation. Return them in JSON format ONLY: {\"title\": \"...\", \"impact\": \"HIGH/MEDIUM/LOW\", \"recommendation\": \"...\"}",
        "session_id": 0,
        "domain": "database",
        "database_name": "YAMROT"
    }
    
    res = requests.post(url, json=payload, timeout=45)
    if res.status_code == 200:
        data = res.json()
        output_str = data.get("output", "")
        # If the output string contains markdown code block notation, strip it
        if "```" in output_str:
            output_str = output_str.split("```")[1]
            if output_str.startswith("json"):
                output_str = output_str[4:]
        
        # Clean whitespaces
        output_str = output_str.strip()
        return json.loads(output_str)
    else:
        raise Exception(f"n8n returned status code {res.status_code}")

def save_to_postgres(rec):
    conn = psycopg2.connect("dbname=erp_demo user=postgres password=postgres host=127.0.0.1")
    cur = conn.cursor()
    
    # 1. Clear old recommendations for YAMROT to keep it fresh
    cur.execute("DELETE FROM ai_recommendations WHERE database_name = 'YAMROT';")
    
    # 2. Insert new recommendation
    cur.execute("""
        INSERT INTO ai_recommendations (database_name, title, impact, recommendation, timestamp)
        VALUES (%s, %s, %s, %s, %s);
    """, ('YAMROT', rec['title'], rec['impact'], rec['recommendation'], datetime.now()))
    
    conn.commit()
    cur.close()
    conn.close()

def main():
    log_file = "C:/Users/Admin/.gemini/antigravity/brain/2c7caf03-205c-4b77-96c3-847c5a718499/scratch/daemon.log"
    
    def log(msg):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        line = f"[{timestamp}] {msg}\n"
        print(line, end="")
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(line)

    log("AI Recommendation Daemon started successfully.")
    
    while True:
        try:
            log("Querying n8n AI agent for fresh database recommendations...")
            rec = get_recommendation_from_ai()
            log(f"Received Recommendation: {rec['title']} (Impact: {rec['impact']})")
            
            log("Saving recommendation to PostgreSQL...")
            save_to_postgres(rec)
            log("Successfully updated AI recommendations in PostgreSQL!")
            
        except Exception as e:
            log(f"Error in daemon iteration: {e}")
            
        log("Sleeping for 5 minutes (300 seconds)...")
        time.sleep(300)

if __name__ == "__main__":
    main()
