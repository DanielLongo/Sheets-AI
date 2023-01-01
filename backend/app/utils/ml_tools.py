import random
from typing import Dict, List
import pandas as pd
from sklearn import ensemble, linear_model, neural_network
import pandas as pd
from sklearn.model_selection import train_test_split
import pickle
MODEL_TYPES = [
    linear_model.LogisticRegression,
    # neural_network.MLPClassifier,
    # ensemble.RandomForestClassifier,
]

def train_model(dataset: pd.DataFrame, output: str, inputs: List[str]) -> Dict[str, float]:
    assert dataset[output].dtype in (bool,)
    assert all(dataset[input].dtype in (float, int) for input in inputs)

    X = dataset[inputs].to_numpy()
    y = dataset[output].to_numpy()

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25)

    model = random.choice(MODEL_TYPES)()
    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)

    return {
        "model_bytes": pickle.dumps(model),
        "inputs": inputs,
        "output": output,
        "accuracy": accuracy,
    }

def make_prediction(model: Dict[str, float], input_: Dict[str, float]) -> float:
    return model.predict_proba(
        pd.DataFrame({input: [input_[input]] for input in input_})
    )[0, model.classes_.tolist().index(True)]