from fastapi import APIRouter, Cookie, Depends, HTTPException, Request
import pandas as pd
from app.utils.ml_tools import train_model
from app.utils.cloud_storage import models_bucket
import hashlib
from datetime import datetime
import pickle
from app.utils.ml_tools import make_prediction

router = APIRouter()


@router.post("/")
async def train(request: Request):
    request_body = await request.json()
    df = pd.DataFrame(request_body["dataArray"])
    prediction_value = request_body["predictColumn"]
    inputs = request_body["inputColumns"]
    if prediction_value in inputs:
        inputs.remove(prediction_value)

    df = df.dropna()

    # cast prediction to boolean
    df[prediction_value] = df[prediction_value].apply(lambda x: str(x).lower() == "true" or str(x) == "1")
    df[prediction_value] = df[prediction_value].astype(bool)

    # cast inputs to float
    for input_ in inputs:
        # check if input is True or False and convert to 1 or 0
        unique_values = [x.lower() for x in df[input_].unique()]
        if set(unique_values) == {"true", "false"}:
            df[input_] = df[input_].apply(lambda x: str(x).lower() == "true")

        df[input_] = df[input_].astype(float)

    res = train_model(df, prediction_value, inputs)
    # model_id is a hash of the model inputs and timestamp
    model_id = hashlib.sha256(
        (str(res["inputs"]) + str(res["output"]) + str(datetime.now())).encode()
    ).hexdigest()
    model_blob = models_bucket.blob(f"model-{model_id}.pkl")
    model_blob.upload_from_string(res["model_bytes"])
    
    return {"modelId": model_id, "accuracy": res["accuracy"], "inputs": inputs}

def cast_params_to_float(params):
    for key, value in params.items():
        string_value = str(value).lower()
        if string_value == "true":
            params[key] = 1.0
        elif string_value == "false":
            params[key] = 0.0
        else:
            params[key] = float(value)
    return params

@router.get("/predict")
async def predict(request: Request):
    params = dict(request.query_params)
    model_id = params["modelId"]
    params.pop("modelId")
    input_ = params
    input_ = cast_params_to_float(input_)
    print("input", input_)
    model_blob = models_bucket.blob(f"model-{model_id}.pkl")
    model_bytes = model_blob.download_as_string()
    model = pickle.loads(model_bytes)

    return {"prediction": make_prediction(model, input_)}
