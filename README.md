# hsa-user-metrics

This repo:

1. fetches UAH-US rate from `https://bank.gov.ua`
2. sends event `uah_us_rate` with rate as `value` param to ga4 via `https://www.google-analytics.com/mp/collect`.

Add to your `.env` file:

- MEASUREMENT_ID
- API_SECRET

run

```bash
npm ci
npm run start
```

