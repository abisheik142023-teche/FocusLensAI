import pandas as pd
import joblib

MODELS_DIR = 'ai-engine/models'

# Load models
prod_model = joblib.load(f'{MODELS_DIR}/productivity_model.pkl')
burn_model = joblib.load(f'{MODELS_DIR}/burnout_model.pkl')
focus_model = joblib.load(f'{MODELS_DIR}/focus_model.pkl')

# Example new employee data
new_data = pd.DataFrame([{
    'focus_time': 5.0,
    'total_time': 8.0,
    'distracted_time': 0.5,
    'app1': 2,
    'app2': 1,
    'app3': 1,
    'avg_productive_hours': 6.2,
    'sentiment_score': 0.5,
    'consistency_score': 0.9
}])

# Feature engineering
new_data['focus_ratio'] = new_data['focus_time'] / (new_data['total_time'] + 1e-6)
new_data['distraction_ratio'] = new_data['distracted_time'] / (new_data['total_time'] + 1e-6)
new_data['app_concentration'] = new_data[['app1','app2','app3']].sum(axis=1)
X_new = new_data[['focus_ratio','distraction_ratio','app_concentration',
                  'avg_productive_hours','sentiment_score','consistency_score']]

# Make predictions
pred_productivity = prod_model.predict(X_new)
pred_burnout = burn_model.predict(X_new)
pred_focus = focus_model.predict(X_new)

print("Predicted Productivity:", pred_productivity[0])
print("Predicted Burnout Risk:", pred_burnout[0])
print("Predicted Focus Score:", pred_focus[0])
