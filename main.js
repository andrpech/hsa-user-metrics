const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({path: envFile});


const Currency = {
    usd: 'usd'
}

const fetchExchangeRate = async (currency) => {
    try {
        const headers = new Headers()
        headers.append('Content-Type', 'application/json')

        const nbuBaseUrl = process.env.NBU_BASE_URL
        const date = new Date()
        const today = formatDate(date)

        const url = `${nbuBaseUrl}?start=${today}&end=${today}&valcode=${currency}&sort=exchangedate&order=desc&json`

        const result = await fetch(url)
        const data = await result.json()
        const exchangeRate = data[0].rate

        console.log(`[fetchExchangeRate] api response: ${JSON.stringify(data)}`)
        console.log(`[fetchExchangeRate] api exchangeRate: ${JSON.stringify(exchangeRate)}`)

        return exchangeRate

    } catch (e) {
        console.log(`[fetchExchangeRate] error: ${e.message}`)
    }
}

const sendGA4Event = async (rateValue) => {
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const clientId = process.env.EXISTED_CLIENT_ID
        const measurementId = process.env.MEASUREMENT_ID
        const apiSecret = process.env.API_SECRET
        const googleAnalyticsBaseUrl = process.env.GOOGLE_ANALYTICS_BASE_URL

        const raw = JSON.stringify({
            client_id: clientId,
            events: [
                {
                    name: "uah_us_rate",
                    params: {
                        value: 55
                    }
                }
            ]
        });

        const url = `${googleAnalyticsBaseUrl}?measurement_id=${measurementId}&api_secret=${apiSecret}`

        console.log(`[sendGA4Event] generated url: ${url}`)

        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: raw,
            redirect: 'follow'
        };

        const result = await fetch(url, requestOptions)
        const data = await result.json()

        console.log(`[sendGA4Event] event sent with properties: ${raw}`)
    } catch (e) {
        console.log(`[sendGA4Event] error: ${e.message}`)
    }

}

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');  // Months are zero-based, so add 1 and pad with a zero if necessary
    const d = String(date.getDate()).padStart(2, '0');  // Pad with a zero if necessary

    return `${y}${m}${d}`;
}

const run = async (timeoutInSec) => {
    const timeoutInMsc = timeoutInSec * 1000

    setInterval(async () => {
        const rate = await fetchExchangeRate(Currency.usd);
        await sendGA4Event(rate);
    }, timeoutInMsc);

}

run(60)