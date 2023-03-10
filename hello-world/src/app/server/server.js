const http = require("http");
const PythonShell = require("python-shell").PythonShell;

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    await PythonShell.run("scripts/test.py").then((data) => {
      console.log("Data:", data[0]);
      res.statusCode = 200;
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST");
      res.setHeader("Content-Type", "text/plain");
      res.end(data[0]);
    });
    return res;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
