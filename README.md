# tethys

A [recreation.gov](https://www.recreation.gov/) permit scraper app.

## Scraper

Scraper is automatically deployed using github actions. The main deployment looks like:

1. Build/push docker container to ECR
2. Update lambda function with new container

The timing for the scraper is handled by an event bridge trigger that fires the lambda function at the top of each hour. The rule for this can be found in the "Triggers" tab [here](https://us-east-2.console.aws.amazon.com/lambda/home?region=us-east-2#/functions/permitScrape?tab=configure).
