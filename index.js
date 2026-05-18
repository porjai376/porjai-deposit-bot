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

function buildDepositFlex() {
  return {
    type: "flex",
    altText: "เลือกประเภทสินค้าที่ต้องการฝาก",
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "พอใจ รับฝากสินค้า",
            weight: "bold",
            size: "xl",
            align: "center"
          },
          {
            type: "text",
            text: "ลูกค้าต้องการฝากสินค้าประเภทไหนครับ",
            wrap: true,
            align: "center",
            size: "md"
          },
          {
            type: "separator",
            margin: "md"
          },
          {
            type: "button",
            style: "primary",
            color: "#FACC15",
            action: {
              type: "message",
              label: "มือถือ",
              text: "ฝากสินค้า:มือถือ"
            }
          },
          {
            type: "button",
            style: "primary",
            color: "#111111",
            action: {
              type: "message",
              label: "เครื่องใช้ไฟฟ้า",
              text: "ฝากสินค้า:เครื่องใช้ไฟฟ้า"
            }
          },
          {
            type: "button",
            style: "secondary",
            action: {
              type: "message",
              label: "สินค้าอื่นๆ",
              text: "ฝากสินค้า:อื่นๆ"
            }
          }
        ]
      }
    }
  };
}

app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    await Promise.all(req.body.events.map(handleEvent));
    res.status(200).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

async function reply(replyToken, messages) {
  return client.replyMessage({
    replyToken,
    messages: Array.isArray(messages) ? messages : [messages]
  });
}

async function handleEvent(event) {
  if (event.type === "message" && event.message.type === "text") {
    const text = event.message.text.trim();

    if (text === "#ทดสอบ") {
      return reply(event.replyToken, {
        type: "text",
        text: "บอททำงานแล้วครับ ✅"
      });
    }

    if (text === "#สนใจฝากสินค้า") {
      return reply(event.replyToken, [
        {
          type: "text",
          text:
`สวัสดีครับ🙏
ลูกค้าต้องการฝากสินค้าประเภทไหนครับ
มือถือ / เครื่องใช้ไฟฟ้าชนิดใด / หรือสินค้ามีค่าประเภทไหน
แจ้งแอดมินได้เลยนะครับ`
        },
        buildDepositFlex()
      ]);
    }

    if (text === "ฝากสินค้า:มือถือ") {
      return reply(event.replyToken, {
        type: "text",
        text:
`มือถือรุ่นไหนครับ
รบกวนลูกค้าถ่ายรูปภาพมือถือ
หากไม่สะดวกถ่าย เชิญมาที่ร้านพอใจรับฝากได้เลยครับ
พิกัด: https://www.google.com/maps?q=16.1741904,102.7281221`
      });
    }

    if (text === "ฝากสินค้า:เครื่องใช้ไฟฟ้า") {
      return reply(event.replyToken, {
        type: "text",
        text:
`เครื่องใช้ไฟฟ้าชนิดใดครับ
รบกวนลูกค้าถ่ายรูปภาพเครื่องใช้ไฟฟ้า
หากไม่สะดวกถ่าย เชิญมาที่ร้านพอใจรับฝากได้เลยครับ
พิกัด: https://www.google.com/maps?q=16.1741904,102.7281221`
      });
    }

    if (text === "ฝากสินค้า:อื่นๆ") {
      return reply(event.replyToken, {
        type: "text",
        text:
`สินค้ามีค่าประเภทใดครับ
รบกวนลูกค้าถ่ายรูปภาพสินค้า
หากไม่สะดวกถ่าย เชิญมาที่ร้านพอใจรับฝากได้เลยครับ
พิกัด: https://www.google.com/maps?q=16.1741904,102.7281221`
      });
    }
  }

  if (event.type === "message" && event.message.type === "image") {
    return reply(event.replyToken, {
      type: "text",
      text:
`แอดมินได้รับภาพเรียบร้อยครับ
จะทำการประเมินราคาให้สักครู่นะครับ
ขอบพระคุณครับ🙏`
    });
  }

  return null;
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Bot Running");
});
