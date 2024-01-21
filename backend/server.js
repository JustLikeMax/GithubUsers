const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

function checkAddress(req, res, next) {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://search-github.vercel.app/",
  ];

  const referrer = req.get("Referrer");
  console.log("A: " + referrer);
  if (
    referrer &&
    allowedOrigins.some((origin) => referrer.startsWith(origin))
  ) {
    return next();
  } else {
    return res.status(403).json({ error: "Access denied" });
  }
}

app.get("/api/user/:username", checkAddress, async (req, res) => {
  try {
    const { username } = req.params;
    const githubApiUrl = `https://api.github.com/users/${username}`;
    const response = await axios.get(githubApiUrl);

    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).json({ error: "Benutzer nicht gefunden" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/search/:username", checkAddress, async (req, res) => {
  try {
    const { username } = req.params;

    if (username.length < 4) {
      res.json([]);
      return;
    }

    const githubApiUrl = `https://api.github.com/search/users?q=${username}&per_page=5`;
    const response = await axios.get(githubApiUrl, {
      headers: {
        Authorization: `Bearer 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`,
      },
    });

    if (response.status === 200) {
      res.json(response.data.items);
    } else {
      res
        .status(response.status)
        .json({ error: "Fehler bei der GitHub-Suche" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
