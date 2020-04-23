const express = require("express");
const { Pool } = require("pg");
const app = express();
const keys = require("./keys");
const bodyParser = require("body-parser");
const cors = require("cors");
const redis = require("redis");

//app.use(cors);
app.use(bodyParser.json());

const pgClient = new Pool({
  host: keys.pgHost,
  user: keys.pgUser,
  port: keys.pgPort,
  password: keys.pgPassword,
  database: keys.pgDatabase,
});

pgClient.on("error", () => {
  console.log("Lost PG Connection");
});

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch((error) => {
    console.log(error);
  });


  const redisClient = redis.createClient({
      host:keys.redisHost,
      port:keys.redisPort,
      retry_strategy:()=>1000
  })

  const redisPublisher = redisClient.duplicate();

  //Routes

  app.get("/",(req,res)=>{
    console.log("Alguien llego a la ruta de test")
    res.send("Hi. I'm working");
  })

  app.get("/values/all",async (req,res)=>{
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values.rows);
  });

  app.get("/values/current", async (req,res)=>{
      const values = redisClient.hgetall("values",(err,values)=>{
          res.send(values);
      })
  })

  app.post("/values",async (req,res)=>{

    const index = req.body.index;

    if(parseInt(index)>40)
    {

        res.status(422).send("Value too high to manage")
    }
    else
    {
      redisClient.hset("values",index,"Nothing yet");
      redisPublisher.publish("insert",index);

      pgClient.query("INSERT INTO values (number) VALUES ($1)",[index])
      res.send({working:true})
    }
  })


app.listen(3000, () => {
  console.log("Listening on port 3000");
});
