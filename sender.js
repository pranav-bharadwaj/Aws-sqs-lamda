"use strict";
var AWS = require("aws-sdk");
var sqs = new AWS.SQS({
  region: "us-east-1",
});
const { DynamoDB } = require("aws-sdk");
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

  // SQS message parameters

  const msgSender = await sqs
    .sendMessageBatch({
      Entries: event.body,
      QueueUrl: queue_url,
      MessageAttributes: {
        DataType: "Number",
        retryAttempts: 1,
      },
    })
    .promise();
  console.log(msgSender);
};
exports.saveDynamo = async (event) => {
  try {
    console.log(event);
  } catch (err) {
    console.log(err);
  }
};
