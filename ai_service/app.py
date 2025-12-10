from flask import Flask

# Import MVC components
from models.ai_model import AIModel
from controllers.prediction_controller import PredictionController
from routes.prediction_routes import create_prediction_routes

app = Flask(__name__)

# Initialize Model
ai_model = AIModel()

# Initialize Controller
prediction_controller = PredictionController(ai_model)

# Register Routes
prediction_routes = create_prediction_routes(prediction_controller)
app.register_blueprint(prediction_routes)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)