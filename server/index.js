import express from "express";

const port = process.env.PORT || 9103;
const app = express();

app.get("/api/greeting", (req, res) => {
  res.type("text/plain").send(`hello world oxzoo-vue-vite_${process.env.GREETING_TAG}`);
});

app.get("/health", (req, res) => {
  res.type("text/plain").send("ok");
});

app.listen(port, "127.0.0.1", () => {
  console.log(`oxzoo-vue-vite API listening on http://127.0.0.1:${port}`);
});
