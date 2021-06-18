// Create table

let AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000",
});

let dynamodb = new AWS.DynamoDB();
let params = {
  TableName: "NodeJsBaseballStats",
  KeySchema: [
    { AttributeName: "TeamID", KeyType: "HASH" }, // PartitionKey
    { AttributeName: "SK", KeyType: "RANGE" }, //SortKey
  ],
  AttributeDefinitions: [
    { AttributeName: "TeamID", AttributeType: "S" },
    { AttributeName: "SK", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

dynamodb.createTable(params, function (err, data) {
  if (err) {
    console.log("Unable to create table!", JSON.stringify(err));
  } else {
    console.log("Table created!");
  }
});
