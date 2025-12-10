import pandas as pd
import xgboost as xgb

class AIModel:
    def __init__(self):
        # Data Dummy Awal
        initial_data = {
            'jarak': [10, 20, 50, 5, 100, 300],
            'berat': [1, 5, 10, 1, 20, 50],
            'waktu': [1, 1, 2, 1, 3, 5] 
        }
        self.df = pd.DataFrame(initial_data)
        self.model = xgb.XGBRegressor()
        self.train()
    
    def train(self):
        """Train the XGBoost model with current data"""
        X = self.df[['jarak', 'berat']]
        y = self.df['waktu']
        self.model.fit(X, y)
        print("Model AI telah dilatih ulang.")
    
    def predict(self, jarak, berat):
        """Make prediction based on jarak and berat"""
        input_df = pd.DataFrame({'jarak': [jarak], 'berat': [berat]})
        prediction = self.model.predict(input_df)[0]
        return float(prediction)
    
    def add_training_data(self, jarak, berat, waktu_aktual):
        """Add new training data and retrain model"""
        new_row = {
            'jarak': jarak, 
            'berat': berat, 
            'waktu': int(waktu_aktual) 
        }
        new_df = pd.DataFrame([new_row])
        self.df = pd.concat([self.df, new_df], ignore_index=True)
        self.train()
        return len(self.df)
    
    def get_total_data(self):
        """Get total number of training data points"""
        return len(self.df)
