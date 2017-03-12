module.expors = {
  "port": 8080,
  "mode": "development",
  "mongoUri" : "mongodb://" + process.env.mongoLogin + ":" +
    process.env.mongoPass + "@ds145359.mlab.com:45359/quests-team5"
}
