from fastapi import APIRouter
from typing import List, Dict, Any
from pydantic import BaseModel

router = APIRouter()

# Response Models
class HealthData(BaseModel):
    db_health: int
    server_health: int
    security_score: int
    ai_status: str

class Alert(BaseModel):
    id: str
    severity: str
    message: str
    timestamp: str

class AlertsResponse(BaseModel):
    alerts: List[Alert]
    total: int

class Recommendation(BaseModel):
    id: str
    title: str
    description: str
    confidence: int

class Notification(BaseModel):
    id: str
    title: str
    timestamp: str

class NotificationsResponse(BaseModel):
    notifications: List[Notification]
    total: int

@router.get("/health", response_model=HealthData)
def get_health():
    # Mock data to be replaced with real DB checks
    return HealthData(
        db_health=85,
        server_health=72,
        security_score=95,
        ai_status="Healthy"
    )

@router.get("/alerts", response_model=AlertsResponse)
def get_alerts(page: int = 1, pageSize: int = 20):
    # Mock data
    alerts = [
        Alert(id="1", severity="Critical", message="Database connection lost in eu-west-1", timestamp="2m ago"),
        Alert(id="2", severity="Warning", message="High memory usage on cluster A", timestamp="15m ago"),
        Alert(id="3", severity="Critical", message="Unauthorized access attempt blocked", timestamp="1h ago"),
        Alert(id="4", severity="Low", message="Scheduled backup completed successfully", timestamp="3h ago"),
    ]
    return AlertsResponse(alerts=alerts, total=len(alerts))

@router.get("/recommendations", response_model=List[Recommendation])
def get_recommendations():
    return [
        Recommendation(
            id="rec_1",
            title="Optimize Database Indexes",
            description="Rebuild indexes on the user table to improve query performance by up to 30%.",
            confidence=94
        )
    ]

@router.get("/notifications", response_model=NotificationsResponse)
def get_notifications(page: int = 1, pageSize: int = 20):
    notifications = [
        Notification(id="n1", title="AI model v2.4 deployed successfully", timestamp="10m ago"),
        Notification(id="n2", title="New security patch available for node clusters", timestamp="2h ago"),
        Notification(id="n3", title="Automated backup completed", timestamp="4h ago"),
        Notification(id="n4", title="Weekly summary report generated", timestamp="1d ago"),
    ]
    return NotificationsResponse(notifications=notifications, total=len(notifications))
