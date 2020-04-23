const redis = require("redis");
const keys = require("./keys")

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: ()=> 1000
})

const sub = redisClient.duplicate()

function fibonacci(n)
{
    if (n == 0) return 1
    else if (n == 1) return 1
    else return fibonacci(n-1)+fibonacci(n-2)
}

sub.on("message",(channel,message)=>{
    redisClient.hset('values',message,fibonacci(parseInt(message)));
})

sub.subscribe("insert")

console.log("Redis Worker Initialized Succesfully")