import google.cloud.storage

client = google.cloud.storage.Client()
models_bucket = client.get_bucket('pretrained-logistic-models')
