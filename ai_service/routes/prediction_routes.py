from flask import Blueprint, request

def create_prediction_routes(prediction_controller):
    """Create Flask Blueprint for prediction routes"""
    bp = Blueprint('prediction', __name__)
    
    @bp.route('/predict', methods=['POST'])
    def predict():
        return prediction_controller.predict(request.json)
    
    @bp.route('/train', methods=['POST'])
    def retrain():
        return prediction_controller.retrain(request.json)
    
    return bp
