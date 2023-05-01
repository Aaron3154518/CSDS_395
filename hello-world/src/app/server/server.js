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
      let flag = args.splice(0, 1)[0];
      console.log(flag, args);
      res.statusCode = 200;
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST");
      res.setHeader("Content-Type", "text/plain");
      if (flag === "t") {
        await PythonShell.run("scripts/SongRecNew.py", {
          args: args,
        }).then((data) => {
          res.write(data[0]);
          res.write("\n");
          res.write(data[1]);
        });
      } else if (flag === "b") {
        await PythonShell.run("scripts/NiaveBayes.py", {
          args: args.join(","),
        }).then((data) => {
          res.write(data[0]);
          res.write("\n");
          res.write(data[1]);
        });
      } else if (flag === "l") {
        await PythonShell.run("scripts/LogisticRegression.py", {
          args: args.join(","),
        }).then((data) => {
          res.write(data[0]);
          res.write("\n");
          res.write(data[1]);
        });
      } else {
        res.statusCode = 404;
      }
      res.end();
    });
    return res;
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
