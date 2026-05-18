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
    altText: "พอใจ รับฝากสินค้า",
    contents: {
      type: "bubble",
      size: "mega",
      styles: {
        body: { backgroundColor: "#0B0B0B" },
        footer: { backgroundColor: "#0B0B0B" }
      },
      body: {
        type: "box",
        layout: "vertical",
        paddingAll: "18px",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "พอใจ รับฝากสินค้า",
            weight: "bold",
            size: "xxl",
            align: "center",
            color: "#FACC15"
          },
          {
            type: "text",
            text: "ลูกค้าต้องการฝากสินค้าประเภทไหนครับ",
            size: "sm",
            align: "center",
            color: "#FFFFFF",
            wrap: true
          },
          {
            type: "separator",
            margin: "md",
            color: "#C9A227"
          },

          {
            type: "box",
            layout: "horizontal",
            spacing: "sm",
            margin: "lg",
            contents: [
              {
                type: "box",
                layout: "vertical",
                cornerRadius: "16px",
                backgroundColor: "#FFFFFF",
                paddingAll: "12px",
                contents: [
                  {
                    type: "text",
                    text: "📱",
                    size: "xxl",
                    align: "center"
                  },
                  {
                    type: "text",
                    text: "มือถือ",
                    weight: "bold",
                    size: "sm",
                    align: "center",
                    color: "#111111"
                  }
                ]
              },
              {
                type: "box",
                layout: "vertical",
                cornerRadius: "16px",
                backgroundColor: "#FFFFFF",
                paddingAll: "12px",
                contents: [
                  {
                    type: "text",
                    text: "🖥️",
                    size: "xxl",
                    align: "center"
                  },
                  {
                    type: "text",
                    text: "ไฟฟ้า",
                    weight: "bold",
                    size: "sm",
                    align: "center",
                    color: "#111111"
                  }
                ]
              },
              {
                type: "box",
                layout: "vertical",
                cornerRadius: "16px",
                backgroundColor: "#FFFFFF",
                paddingAll: "12px",
                contents: [
                  {
                    type: "text",
                    text: "💎",
                    size: "xxl",
                    align: "center"
                  },
                  {
                    type: "text",
                    text: "ของมีค่า",
                    weight: "bold",
                    size: "sm",
                    align: "center",
                    color: "#111111"
                  }
                ]
              }
            ]
          },

          {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            margin: "lg",
            contents: [
              menuButton("📱", "มือถือ", "สมาร์ทโฟน / แท็บเล็ต", "#FACC15", "#111111", "ฝากสินค้า:มือถือ"),
              menuButton("🖥️", "เครื่องใช้ไฟฟ้า", "ทีวี / ตู้เย็น / เครื่องซักผ้า ฯลฯ", "#1A1A1A", "#FFFFFF", "ฝากสินค้า:เครื่องใช้ไฟฟ้า"),
              menuButton("💎", "สินค้าอื่นๆ", "ทอง / เครื่องประดับ / ของมีค่า", "#F5F5F5", "#111111", "ฝากสินค้า:อื่นๆ")
            ]
          }
        ]
      },
      footer: {
        type: "box",
        layout: "horizontal",
        spacing: "sm",
        paddingAll: "16px",
        contents: [
          footerItem("⚡", "ประเมิน", "รวดเร็ว"),
          footerItem("🛡️", "ให้ราคาดี", "ยุติธรรม"),
          footerItem("🔒", "ปลอดภัย", "เชื่อถือได้")
        ]
      }
    }
  };
}

function menuButton(icon, title, desc, bgColor, textColor, messageText) {
  return {
    type: "box",
    layout: "horizontal",
    backgroundColor: bgColor,
    cornerRadius: "18px",
    paddingAll: "14px",
    action: {
      type: "message",
      label: title,
      text: messageText
    },
    contents: [
      {
        type: "text",
        text: icon,
        size: "xl",
        flex: 1,
        align: "center"
      },
      {
        type: "box",
        layout: "vertical",
        flex: 5,
        contents: [
          {
            type: "text",
            text: title,
            weight: "bold",
            size: "lg",
            color: textColor
          },
          {
            type: "text",
            text: desc,
            size: "xs",
            color: textColor,
            wrap: true
          }
        ]
      },
      {
        type: "text",
        text: "›",
        size: "xxl",
        weight: "bold",
        color: textColor,
        align: "end",
        flex: 1
      }
    ]
  };
}

function footerItem(icon, title, desc) {
  return {
    type: "box",
    layout: "vertical",
    flex: 1,
    contents: [
      {
        type: "text",
        text: icon,
        size: "lg",
        align: "center"
      },
      {
        type: "text",
        text: title,
        size: "xxs",
        color: "#FFFFFF",
        align: "center",
        wrap: true
      },
      {
        type: "text",
        text: desc,
        size: "xxs",
        color: "#FACC15",
        align: "center",
        weight: "bold"
      }
    ]
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
