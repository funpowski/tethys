# scraper

Scrape rec.gov and write to supabase; meant to be run as lambda

## Testing locally

Local environment:

```bash
pip install -r requirements.txt
export AWS_DEFAULT_PROFILE=personal  # or other
python scraper.py
```

Docker:

```bash
docker build -t tethys -f Dockerfile.test .
docker run -it tethys bash
```
