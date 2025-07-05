import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));

// Page navigation
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
})

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
})

// DWDS API
app.get("/dwds", async (req, res) => {
  const userInput = req.query.word.split(" ");
  const word = userInput.join("|").trim();
  console.log(`Searching for: ${word}`);

  // DWDS API configuration (usually just word as a query parameter)
  const confiDWDS = {
    params: {
      q: word
    }
  }
  // DWDS API endpoints
  const endpointsDWDS = [
    "https://www.dwds.de/api/wb/snippet/",
    "https://www.dwds.de/api/frequency/",
  ]

  // get the results from the APIs
  try {
    // Fetch data from DWDS API
    const resultsDWDS = await Promise.all(endpointsDWDS.map((endpoint) => {
      return axios.get(endpoint, confiDWDS);
    }))

    res.render("index.ejs", {
      dwdsData: resultsDWDS[0].data,
      dwdsFrequency: resultsDWDS[1].data,
    });
  } catch (error) {
    console.error("Error fetching data with message:", error.message);
    res.render("index.ejs", {
      dwdsData: null,
      dwdsFrequency: null,
      error: "Error fetching data."
    });
  }


})



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})