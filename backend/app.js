const express = require('express')
const axios = require('axios')
require('dotenv').config()
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const redirectUri =  'http://localhost:5173/frontpage'

let clientId = process.env.CLIENT_ID
//let code = ''

const generateRandomString = () => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(64))
  return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

const codeVerifier  = generateRandomString()

const hashTheCodeVerifierWithSha256 = async (codeVerifier) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const hashedData = await crypto.subtle.digest('SHA-256', data)
  console.log('täällä', hashedData)
  return btoa(String.fromCharCode(...new Uint8Array(hashedData)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

app.post('/api/token', async (request, response) => {
  //const code_verifier = localStorage.getItem('code_verifier')
  const code = request.body.code
  console.log(code)

  const url = 'https://accounts.spotify.com/api/token'
  console.log('PARAMS:', clientId, code, redirectUri, codeVerifier)


  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  }

  const body = await fetch(url, payload);
  const token = await body.json();

  //const body = response1.body

  console.log('BÄCKISSÄ')
  console.log(token)
  //response.send(response1);
})

app.get('/api/login', async (request, response) => {
  console.log('TÄÄLLÄÄ',  process.env.CLIENT_ID)
  //codeVerifier  = generateRandomString();
  console.log('YEEEt',codeVerifier)
  const hashed = await hashTheCodeVerifierWithSha256(codeVerifier)
  code = hashed
  //console.log('2',hashed)
  //window.localStorage.setItem('code_verifier', codeVerifier)
  const scope = 'user-read-private user-read-email'
  const authorizationEndpoint = "https://accounts.spotify.com/authorize"
  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: hashed,
    redirect_uri: 'http://localhost:5173/frontpage',
  }
  const authUrl = new URL(authorizationEndpoint)
  authUrl.search = new URLSearchParams(params).toString()
  response.status(201).json(authUrl.toString())
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


module.exports = app