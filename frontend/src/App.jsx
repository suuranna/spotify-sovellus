//require('dotenv').config()
//import './App.css'
import axios from 'axios'

const App = () => {
  const goToSpotifyLogin = async () => {
    
    const response = await axios.get('/api/login')
    //const aa = anwer.then((response) => response.data)
    const authUrl = response.data
    //console.log('frontissa', anwer.data)
    window.location.href = authUrl.toString()

    const urlParams = new URLSearchParams(window.location.search)
    let code = urlParams.get('code')

    console.log(code)


  }
  return (
    <div>
      <p>spotify sovellus</p>
      <button onClick={goToSpotifyLogin}>kirjaudu</button>
    </div>
  )
}

export default App
