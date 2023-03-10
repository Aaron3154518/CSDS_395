const http = require("http");
const PythonShell = require("python-shell").PythonShell;

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    await PythonShell.run("scripts/SongRec.py", {
      //args: ["Never Gonna Give You Up", "Rick Astley"],
    }).then((data) => {
      res.statusCode = 200;
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST");
      res.setHeader("Content-Type", "text/plain");
      res.write(data[0]);
      res.write("\n");
      res.write(data[1]);
      res.end();
    });
    return res;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
