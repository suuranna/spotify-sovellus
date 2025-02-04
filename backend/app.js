const express = require('express')
const axios = require('axios')
require('dotenv').config()
const cors = require('cors')

const app = express()

app.use(cors())

const generateRandomString = () => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(64))
  return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

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

app.get('/api/login', async (request, response) => {
  console.log('TÄÄLLÄÄ',  process.env.CLIENT_ID)
  const codeVerifier  = generateRandomString();
  console.log(codeVerifier)
  const hashed = await hashTheCodeVerifierWithSha256(codeVerifier)
  console.log('2',hashed)
  //window.localStorage.setItem('code_verifier', codeVerifier)
  const scope = 'user-read-private user-read-email'
  const authorizationEndpoint = "https://accounts.spotify.com/authorize"
  const params =  {
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope: scope,
    code_challenge_method: 'S256',
    code_challenge: hashed,
    redirect_uri: 'http://localhost:5173',
  }
  const authUrl = new URL(authorizationEndpoint)
  authUrl.search = new URLSearchParams(params).toString()
  //window.location.href = authUrl.toString()
  console.log(authUrl.toString())
  //response.header('Access-Control-Allow-Origin', 'http://localhost:5173'); 
  //response.redirect(302, authUrl.toString())
  //const spotifyResponse = await axios.get(authUrl.toString())
  //console.log(spotifyResponse)
  response.status(201).json(authUrl.toString())
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


module.exports = app