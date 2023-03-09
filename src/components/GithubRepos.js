import React, { useState, useEffect, useRef } from "react";

function App() {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetch(
      `https://api.github.com/search/repositories?q=stars:>1&sort=stars&order=desc&page=${page}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRepos((prevRepos) => [...prevRepos, ...data.items]);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, options);
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
  }, []);

  const handleObserver = (entries, observer) => {
    if (entries[0].isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="main card">
      <h1>Most Starred GitHub Repositories</h1>

      {repos.map((repo) => (
        <div className="card detail">
          <li key={repo.id}>
            <img src={repo.owner.avatar_url} alt={repo.owner.login} />
            <div className="section-right">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
              <p>{repo.description}</p>
              <p className="last-pushed">
                Last pushed on {new Date(repo.pushed_at).toLocaleDateString()}{" "}
                by {repo.owner.login}
              </p>
            </div>
            <div className="buttons">
              <p> stars: {repo.stargazers_count} </p>&nbsp;
              <p> issues: {repo.open_issues_count} </p>
            </div>
          </li>
        </div>
      ))}

      {loading && <p>Loading...</p>}
      <div ref={loaderRef} style={{ height: "10px" }}></div>
    </div>
  );
}

export default App;
