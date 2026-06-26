import { useState, useEffect } from "react";
import './App.css'
export default function App() {
  const [moviename, setMoviename] = useState('')
  const [error, setError] = useState(null)
  const [list, setList] = useState(JSON.parse(localStorage.getItem("watchlist")) || [])
  const [filter, setFilter] = useState("all")
  async function Render() {
    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${moviename}`)
      if (!response.ok) throw new Error("failed to fetch")
      const data = await response.json()
      setList(data.map(movie => ({ ...movie, saved: false, watched: false })))
      setMoviename('')
    }
    catch (err) {
      setError(err.message)
    }
  }
  function Toggle(id) {
    setList(list.map((li) => li.show.id === id ? { ...li, saved: !li.saved } : li))
  }
  function ToggleWatched(id) {
    setList(list.map((li) => li.show.id === id ? { ...li, watched: !li.watched } : li))
  }
  const filtered = list.filter((e) => {
    if (filter === "saved") return e.saved
    if (filter === "watched") return e.watched
    return true
  })
  const count = list.filter((li) => li.saved).length
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(list))
  }, [list])
  return (
    <div>
      <div className="nav">
        <h1 className="header">MovieList</h1>
        <div className="count">Saved: {count}</div>
      </div>
      <div className="searchpart">
        <input
          type="text"
          onChange={(e) => setMoviename(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && Render()}
          value={moviename}
          className="searchbar"
          placeholder="search a movie"
        />
        <button onClick={Render} className="searchbtn">Search</button>
      </div>
      <div className="filterbtns">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("saved")}>Saved</button>
        <button onClick={() => setFilter("watched")}>Watched</button>
      </div>
      {error && <p>{error}</p>}
      <div className="listoutline">
        {filtered && (
          filtered.map((li, id) => (
            <div key={li.show.id} className={`movielist ${li.saved ? "is-saved" : ""} ${li.watched ? "is-watched" : ""}`}>
              {li.show.image ? <img src={li.show.image.medium} width="80px" className="image" /> : <h1>No image</h1>}
              <div className="half">
                <p className="moviename">{li.show.name}</p>
                {li.show.rating && <p className="rating">{li.show.rating.average}</p>}``
                {/* <div dangerouslySetInnerHTML={{ __html: li.show.summary }} /> */}
                <button onClick={() => Toggle(li.show.id)} className={`savedbtn ${!li.saved ? "click" : "notclick"}`}>{li.saved ? "Remove" : "Add to Watchlist"}</button>
                {li.saved && (
                  <button onClick={() => ToggleWatched(li.show.id)} className={`watchedbtn ${!li.watched ? "watchclick" : "watchnotclick"}`}>{li.watched ? "Unwatch" : "Mark Watched"}</button>
                )}
              </div>

            </div>

          ))
        )}
      </div>
    </div>
  )
}