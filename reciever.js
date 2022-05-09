"use strict";
var AWS = require("aws-sdk");
const backoff = require("./Backoff");

AWS.config.update({ region: "us-east-1" });
const AWS_ACC = process.env.ACCOUNT_ID;
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
const queue_url = `https://sqs.us-east-1.amazonaws.com/${AWS_ACC}/FirstQueMsg`;
module.exports.recieverMsg = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "function executed successfully!",
      input: event.Records.body,
    }),
  };

  console.log("event: ", JSON.stringify(event));

  var body = event.Records[0].body;
  console.log("text: ", JSON.parse(body).text);

  callback(null, response);
  return response;
};

module.exports.replyMsgHandler = async (event) => {
  for (let i = 0; i < event.Records.length; i++) {
    let numofreply = 0;
    let arr = event.Records[i];
    console.log(event.Records);
    if (arr.includes("MessageAttributes")) {
      numofreply = parseInt(arr[0].messageAttributes.retryAttempts);
    }
    numofreply += 1;
    event.Records[i].messageAttributes.retryAttempts = numofreply;
    var delaySec = backoff.expo(numofreply);
    var b = backoff.backoff(1.5, 60);
  }
  var params = {
    QueueUrl: queue_url,
    DelaySeconds: delaySec,
    MessageBody: event.Records[i].body,
    MessageAttributes: {
      DataType: "Number",
      retryAttempts: numofreply,
    },
  };
  sqs.sendMessage(params, function (err, data) {
    if (err) {
      console.log("Error occured due to ", err);
    } else {
      console.log("Successfully send messages to queue ", data.MessageId);
    }
  });
};
