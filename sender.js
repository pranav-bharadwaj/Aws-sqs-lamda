"use strict";
var AWS = require("aws-sdk");
var sqs = new AWS.SQS({
  region: "us-east-1",
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const AWS_ACC = process.env.ACCOUNT_ID;
const queue_url = `https://sqs.us-east-1.amazonaws.com/${AWS_ACC}/FirstQueMsg`;

const msgBatchProducer = () => {
  let arr = new Array();
  for (let i = 0; i < 10; i++) {
    arr.push({
      Id: Math.random() * 10000,
      MessageBody: "This is a message of id " + id,
    });
  }
  return arr;
};
exports.handler = async (event, context, callback) => {
  // response and status of HTTP endpoint
  var responseBody = {
    message: "",
  };
  var responseCode = 200;
  try {
    const msgSender = await sqs
      .sendMessageBatch({
        Entries: msgBatchProducer(),
        QueueUrl: queue_url,
        MessageAttributes: {
          DataType: "Number",
          retryAttempts: 1,
        },
      })
      .promise();
    return responseCode;
  } catch (err) {
    console.log(err);
    return { status: 500, desc: "Bad request" };
  }
  // SQS message parameters
};
exports.saveDynamo = async (event) => {
  try {
    // Loop over all msgs in dlq which have already max attempts
    for (let i = 0; i < event.Records.length; i++) {
      if (event.Records[i].messageAttributes.retryAttempts >= 3) {
        const params = {
          TableName: "failedmsg",
          Item: {
            id: uuid.v1(),
            Value: event.Records[i].body,
          },
        };
        await dynamoDb.put(params).promise();
      }
    }
  } catch (err) {
    console.log(err);
  }
};
