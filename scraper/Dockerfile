FROM public.ecr.aws/lambda/python:3.9

COPY . ${LAMBDA_TASK_ROOT}
RUN pip install -r requirements.txt --target "${LAMBDA_TASK_ROOT}"
CMD ["scraper.handler"]