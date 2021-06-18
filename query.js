let AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000",
});

let tableName = "NodeJsBaseballStats";

let dynamodb = new AWS.DynamoDB();

getGame("LAA", "20190420")
  .then((game) => {
    console.log(JSON.stringify(game));
  })
  .catch((ex) => {
    console.log("An error occured", ex);
  });

getGames("LAA", "20190401", "20190501", "SEA")
  .then((games) => {
    console.log(JSON.stringify(games));
  })
  .catch((ex) => {
    console.log("An error occured", ex);
  });

function getGame(teamId, dateStr) {
  return new Promise((resolve, reject) => {
    let params = {
      KeyConditionExpression: "TeamID = :t AND SK = :sk",
      ExpressionAttributeValues: {
        ":t": { S: "GAMES_" + teamId },
        ":sk": { S: dateStr },
      },
      TableName: tableName,
    };
    dynamodb.query(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function getGames(teamId, startDate, endDate, opposingTeamId) {
  return new Promise((resolve, reject) => {
    let params = {
      KeyConditionExpression:
        "TeamID = :t AND SK BETWEEN :startDate AND :endDate",
      ExpressionAttributeValues: {
        ":t": { S: "GAMES_" + teamId },
        ":startDate": { S: startDate },
        ":endDate": { S: endDate },
        ":opp": { S: opposingTeamId },
      },
      FilterExpression: "OpposingTeamID = :opp",
      TableName: tableName,
    };
    dynamodb.query(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
