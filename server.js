const fs = require("fs");
const express = require("express");
const app = express();

const PORT = 7000
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const handleRequest = (res, path, type) => {
    fs.readFile(path, (err, data) => {
        if (err) throw err;

        res.writeHead(200, type)
        return res.end(data)
    })
}
app.get("/api/notes", (req, res) => {

    handleRequest(res, "./db/db.json", { "Content-Type": "application/json" })
})

app.get("/notes", (req, res) => {

    handleRequest(res, "./public/notes.html", { "Content-Type": "text/html" })

})
app.post("/api/notes", (req, res) => {
    const note = req.body;
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        const parseData = JSON.parse(data)
        note.id = Date.now()
        parseData.push(note)
        fs.writeFile("./db/db.json", JSON.stringify(parseData), (err) => {
            if (err) throw err;
            res.writeHead(200, { "Content-Type": "application/json" })
            return res.end(JSON.stringify(note))
        });
    })


    

})

app.delete("/api/notes/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const note = req.body;
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        const parseData = JSON.parse(data)
       const newData = parseData.filter((item,index)=>{
            return !(item.id===id); 
        })

        fs.writeFile("./db/db.json", JSON.stringify(newData), (err) => {
            if (err) throw err;
            res.writeHead(200, { "Content-Type": "application/json" })
            return res.end(JSON.stringify(note))
        });
    })
})



app.use(express.static('public'));


app.get("/*", (req, res) => {
    handleRequest(res, "./public/index.html", { "Content-Type": "text/html" })
})

app.listen(PORT, function () {
    console.log("server listening" + PORT)
})