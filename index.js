import express from "express";
const app = express();

// folder public (HTML, CSS, JS)
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Halo Billy, Node.js kamu aktif di Vercel! 🚀");
});

// Vercel pakai port environment (jangan hardcode)
app.listen(process.env.PORT || 3000);
