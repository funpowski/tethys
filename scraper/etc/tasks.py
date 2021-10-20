from celery import Celery

app = Celery('tasks', broker='pyamqp://guest@rabbitmq.tethys-net//')

@app.task
def add(x, y):
    return x + y
