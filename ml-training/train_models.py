import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, accuracy_score
import joblib
import os
import logging

# ---------------- Logging ---------------- #
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- Paths ---------------- #
DATA_PATH = 'data/performance_data.csv'
MODELS_DIR = 'ai-engine/models'  # Correct path inside ml-training

# ---------------- Load & preprocess ---------------- #
def load_and_preprocess(filepath=DATA_PATH):
    df = pd.read_csv(filepath)
    logger.info(f"Loaded {len(df)} rows")

    # Features
    df['focus_ratio'] = df['focus_time'] / (df['total_time'] + 1e-6)
    df['distraction_ratio'] = df['distracted_time'] / (df['total_time'] + 1e-6)
    for col in ['app1','app2','app3']:
        if col not in df.columns: df[col] = 0
    df['app_concentration'] = df[['app1','app2','app3']].sum(axis=1)

    X = df[['focus_ratio','distraction_ratio','app_concentration',
            'avg_productive_hours','sentiment_score','consistency_score']]
    y_prod = df['productivity_score']
    y_burn = df['burnout_risk']
    y_focus = df['focus_score']
    return X, y_prod, y_burn, y_focus

# ---------------- Train & save models ---------------- #
def train_and_save():
    X, y_prod, y_burn, y_focus = load_and_preprocess()

    # Productivity Model
    X_train, X_test, y_train, y_test = train_test_split(X, y_prod, test_size=0.2, random_state=42)
    prod_model = RandomForestRegressor(n_estimators=100, random_state=42)
    prod_model.fit(X_train, y_train)
    preds = prod_model.predict(X_test)
    logger.info(f'Productivity MSE: {mean_squared_error(y_test,preds):.4f}')

    # Burnout Model (binary classifier)
    y_b_cls = (y_burn > 0.5).astype(int)
    X_train, X_test, y_train, y_test = train_test_split(X, y_b_cls, test_size=0.2, random_state=42)
    burn_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    burn_model.fit(X_train, y_train)
    acc = accuracy_score(y_test, burn_model.predict(X_test))
    logger.info(f'Burnout accuracy: {acc:.4f}')

    # Focus Model
    X_train, X_test, y_train, y_test = train_test_split(X, y_focus, test_size=0.2, random_state=42)
    focus_model = RandomForestRegressor(n_estimators=100, random_state=42)
    focus_model.fit(X_train, y_train)
    logger.info(f'Focus MSE: {mean_squared_error(y_test, focus_model.predict(X_test)):.4f}')

    # ---------------- Save models ---------------- #
    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(prod_model, os.path.join(MODELS_DIR, 'productivity_model.pkl'))
    joblib.dump(burn_model, os.path.join(MODELS_DIR, 'burnout_model.pkl'))
    joblib.dump(focus_model, os.path.join(MODELS_DIR, 'focus_model.pkl'))
    logger.info('Models saved to ai-engine/models')

# ---------------- Main ---------------- #
if __name__ == '__main__':
    train_and_save()
