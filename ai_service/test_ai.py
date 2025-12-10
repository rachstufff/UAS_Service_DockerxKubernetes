import json
from app import app

def test_predict():
    client = app.test_client()
    
    response = client.post('/predict', json={
        "jarak": 20,
        "berat": 5
    })

    assert response.status_code == 200
    data = response.get_json()
    assert "estimasi_hari" in data
    assert data["estimasi_hari"] >= 1

def test_train():
    client = app.test_client()

    response = client.post('/train', json={
        "jarak": 10,
        "berat": 2,
        "waktu_aktual_hari": 1
    })

    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"
