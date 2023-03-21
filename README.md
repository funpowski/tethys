# tethys

A [recreation.gov](https://www.recreation.gov/) permit scraper app.

## Building Scraper Manually

```bash
cd scraper
pip install -r requirements.txt -t .
zip -r9 ../scraper_lambda.zip * -x "bin/*" requirements.txt
aws lambda update-function-code --function-name permitScrape --zip-file fileb://scraper_lambda.zip
```
