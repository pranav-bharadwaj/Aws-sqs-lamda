"use strict";

exports.handler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "function executed successfully!",
      input: event,
    }),
  };

  console.log("event: ", JSON.stringify(event));

  var body = event.Records[0].body;
  console.log("text: ", JSON.parse(body).text);

  callback(null, response);
  return response;
};

exports.replyMsgHandler = async (event) => {
  for (let i = 0; i < event.Records; i++) {
    let numofreply = 0;
    let arr = event.Records;
    if (arr.includes("MessageAttributes")) {
      numofreply = parseInt(arr.messageAttributes.retryAttempts);
    }
    numofreply += 1;
    let records = event.Records.messageAttributes;
    records.push({records.})
  }
};
