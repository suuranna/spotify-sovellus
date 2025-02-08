//require('dotenv').config()
//import './App.css'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

let code_verifier = ''


const getToken = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  console.log('Frontissa')
  console.log(code)
  console.log(typeof(code))
  
  const url = new URL(window.location.href);
  url.searchParams.delete("code");

  const updatedUrl = url.search ? url.href : url.href.replace('?', '');
  window.history.replaceState({}, document.title, updatedUrl);

  console.log(code)
  const jotain = await axios.post('/api/token', {code: code})
  console.log(jotain)
}

const FrontPage = () => {
  const url = new URL(window.location.href);
  //console.log(url)

  if (url.href !== 'http://localhost:5173/frontpage') {
    console.log('ifissä')
    getToken()
  }

  return (
    <div>
      <p>Olet kirjautunut sisään</p>
    </div>
  )
}

const BeforeLoginPage = () => {
  const goToSpotifyLogin = async () => {
    
    const response = await axios.get('/api/login')
    const authUrl = response.data
    window.location.href = authUrl.toString()


  }

  return (
    <div>
      <p>spotify sovellus</p>
      <button onClick={goToSpotifyLogin}>kirjaudu</button>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<BeforeLoginPage />} />
        <Route path='/frontpage' element={<FrontPage />} />
      </Routes>
    </Router>
  )
}

export default App
