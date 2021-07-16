require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
app.get('/:name', async (req, res) => {
    const name = req.params.name.toLowerCase();
    let latestDate;
    let url;
// Set URL to use photos API for Opportunity & Spirit
    if (name === 'opportunity')
    {
        latestDate = '2016-01-24'
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=${latestDate}&api_key=${process.env.API_KEY}`
    }
    else if (name === 'spirit')
    {
        latestDate = '2010-02-05'
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=${latestDate}&api_key=${process.env.API_KEY}`
    }
// Set URL to use latest_photos API for active rover Curiosity    
    else if (name === 'curiosity')
    {
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/latest_photos?api_key=${process.env.API_KEY}`
    }
    else
    {
        res.send('Invalid address.')
        return
    }
// Initiate API call with desired URL
    try
    {
        const data = await fetch(url)
            .then(res => res.json())
        res.send({ data })
    }
    catch (err)
    {
        console.log('error:', err);
    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))