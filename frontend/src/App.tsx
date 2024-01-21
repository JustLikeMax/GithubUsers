import { useState, useEffect } from "react";

interface USERDATA {
  name: string;
  avatar_url: string;
  location: string;
  followers: string;
  following: string;
  public_repos: string;
  login: string;
}

const App = () => {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<USERDATA | null>(null);
  const [searchResults, setSearchResults] = useState<USERDATA[]>([]);

  useEffect(() => {
    const searchUsers = async () => {
      try {
        if (username.length >= 4) {
          const response = await fetch(
            `https://search-github-backend.onrender.com/api/search/${username}`
          );
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
          } else {
            setSearchResults([]);
          }
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    searchUsers();
  }, [username]);

  const fetchUserData = async (user: string) => {
    try {
      const response = await fetch(
        `https://search-github-backend.onrender.com/api/user/${user}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        alert("Benutzer nicht gefunden. Bitte überprüfe den Benutzernamen.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {userData ? (
        <div className="flex flex-col items-center">
          <div className="bg-gray-800 p-6 rounded-lg border border-blue-500 mb-4">
            <img
              className="w-32 h-32 rounded-full mb-2"
              src={userData.avatar_url}
              alt="Avatar"
            />
            <div className="text-lg mb-2">Name: {userData.login || "-"}</div>
            {userData.location && (
              <div className="mb-2">Location: {userData.location}</div>
            )}
            <div className="mb-2">Follower: {userData.followers}</div>
            <div className="mb-2">Following: {userData.following}</div>
            <div>Public Repos: {userData.public_repos}</div>
          </div>

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => {
              setUserData(null);
              setUsername("");
            }}
          >
            Zurück
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <header className="text-3xl font-bold mb-6 text-blue-500">
            GitHub user search
          </header>
          <input
            className="w-80 h-10 border border-gray-400 p-2 rounded mb-4 text-black"
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="text-lg font-semibold mb-2">Possible users:</p>
          {searchResults.length === 0 ? (
            <p className="text-gray-500 mt-4">
              No users found. Start searching!
            </p>
          ) : (
            <></>
          )}
          {searchResults.length > 0 && (
            <div className="flex flex-col items-center mb-4">
              <div className="flex space-x-4">
                {searchResults.map((user) => (
                  <div
                    key={user.login}
                    onClick={() => fetchUserData(user.login)}
                    className="bg-gray-800 p-4 rounded-lg cursor-pointer transition duration-300 hover:bg-gray-700"
                  >
                    <div className="text-white">{user.login}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
