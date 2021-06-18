let AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000",
});

let tableName = "NodeJsBaseballStats";

let dynamodb = new AWS.DynamoDB();

//load the data
let teams = require("./data/teams.json");
let players = require("./data/players.json");
let games = require("./data/games.json");
const { DynamoDB } = require("aws-sdk");

putItems(teams)
  .then(() => {
    putItems(players);
  })
  .then(() => {
    putItems(games);
  })
  .catch((err) => {
    console.error("Insert failed", err);
  });

function putItems(items) {
  let insertedCount = 0;
  return new Promise((resolve, reject) => {
    items.forEach((item) => {
      let params = {
        TableName: tableName,
        Item: item,
      };
      dynamodb.putItem(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (++insertedCount == items.length) {
            console.log("Successfully inserted " + items.length + " items.");
            resolve();
          }
        }
      });
    });
  });
}
