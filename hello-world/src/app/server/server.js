const http = require("http");
const PythonShell = require("python-shell").PythonShell;

const hostname = "127.0.0.1";
const port = 3300;

const server = http.createServer(async (req, res) => {
  console.log(req.method);
  if (req.method === "POST") {
    const chunks = [];
    req.on("data", (data) => chunks.push(data));
    req.on("end", async () => {
      let args = chunks.toString().split(",");
      console.log(args);
      await PythonShell.run("scripts/SongRecNew.py", {
        args: args,
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
    });
    return res;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
