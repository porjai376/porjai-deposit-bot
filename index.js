require("dotenv").config();

const express = require("express");
const line = require("@line/bot-sdk");

const app = express();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

app.post(
  "/webhook",
  line.middleware(config),
  async(req,res)=>{
    try{
      await Promise.all(
        req.body.events.map(handleEvent)
      );

      res.status(200).end();

    }catch(err){
      console.log(err);
      res.status(500).end();
    }
  }
);

async function handleEvent(event){

  if(
    event.type==="message" &&
    event.message.type==="text"
  ){

    if(event.message.text==="#ทดสอบ"){

      return client.replyMessage({
        replyToken:event.replyToken,
        messages:[
          {
            type:"text",
            text:"บอททำงานแล้วครับ ✅"
          }
        ]
      });

    }

  }

  return null;
}

app.listen(process.env.PORT||3000,()=>{
  console.log("Bot Running");
});