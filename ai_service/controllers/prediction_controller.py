import math
from flask import jsonify

class PredictionController:
    def __init__(self, ai_model):
        self.ai_model = ai_model
    
    def predict(self, request_data):
        """Handle prediction request"""
        try:
            jarak = request_data['jarak']
            berat = request_data['berat']
            
            prediction = self.ai_model.predict(jarak, berat)
            
            # Pembulatan ke atas agar minimal 1 hari
            estimasi = math.ceil(prediction)
            if estimasi < 1:
                estimasi = 1

            return jsonify({
                'status': 'success',
                'estimasi_hari': int(estimasi),
            }), 200
        except KeyError as e:
            return jsonify({'error': f'Missing required field: {str(e)}'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def retrain(self, request_data):
        """Handle retraining request"""
        try:
            jarak = request_data['jarak']
            berat = request_data['berat']
            waktu_aktual = request_data['waktu_aktual_hari']
            
            total_data = self.ai_model.add_training_data(jarak, berat, waktu_aktual)
            
            return jsonify({
                'status': 'success',
                'message': 'Model berhasil belajar data baru.',
                'total_data': total_data
            }), 200
        except KeyError as e:
            return jsonify({'error': f'Missing required field: {str(e)}'}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
