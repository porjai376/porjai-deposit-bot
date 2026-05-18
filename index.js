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

const MAP_URL = "https://www.google.com/maps?q=16.1741904,102.7281221";
const ADMIN_PHONE = "0615254648";
const ADMIN_USER_ID = process.env.ADMIN_USER_ID || "";

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
              topCategory("📱", "มือถือ"),
              topCategory("🖥️", "ไฟฟ้า"),
              topCategory("💎", "ของมีค่า")
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

function topCategory(icon, title) {
  return {
    type: "box",
    layout: "vertical",
    cornerRadius: "16px",
    backgroundColor: "#FFFFFF",
    paddingAll: "12px",
    contents: [
      {
        type: "text",
        text: icon,
        size: "xxl",
        align: "center"
      },
      {
        type: "text",
        text: title,
        weight: "bold",
        size: "sm",
        align: "center",
        color: "#111111"
      }
    ]
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

function buildAskPhotoFlex(typeName, question, photoText) {
  return {
    type: "flex",
    altText: question,
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#0B0B0B",
        paddingAll: "20px",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "พอใจ รับฝากสินค้า",
            weight: "bold",
            size: "xl",
            color: "#FACC15",
            align: "center"
          },
          {
            type: "separator",
            color: "#C9A227",
            margin: "md"
          },
          {
            type: "text",
            text: typeName,
            weight: "bold",
            size: "lg",
            color: "#FFFFFF",
            align: "center"
          },
          {
            type: "text",
            text: question,
            wrap: true,
            size: "md",
            color: "#FFFFFF",
            align: "center"
          },
          {
            type: "text",
            text: photoText,
            wrap: true,
            size: "sm",
            color: "#E5E7EB",
            align: "center"
          },
          {
            type: "button",
            style: "primary",
            color: "#FACC15",
            action: {
              type: "uri",
              label: "📸 อัพโหลด / ถ่ายภาพ",
              uri: "line://nv/camera"
            }
          },
          {
            type: "button",
            style: "secondary",
            action: {
              type: "uri",
              label: "📍 เปิดแผนที่ร้าน",
              uri: MAP_URL
            }
          },
          {
            type: "text",
            text: "หากไม่สะดวกถ่าย เชิญมาที่ร้านพอใจรับฝากได้เลยครับ",
            wrap: true,
            size: "xs",
            color: "#FACC15",
            align: "center"
          }
        ]
      }
    }
  };
}

function buildImageReceivedFlex() {
  return {
    type: "flex",
    altText: "ได้รับภาพสินค้าเรียบร้อยครับ",
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#0B0B0B",
        paddingAll: "20px",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "📸 ได้รับภาพแล้วครับ",
            weight: "bold",
            size: "xl",
            color: "#FACC15",
            align: "center"
          },
          {
            type: "separator",
            color: "#C9A227",
            margin: "md"
          },
          {
            type: "text",
            text: "หากมีหลายภาพ สามารถส่งมาต่อได้เลยนะครับ",
            wrap: true,
            size: "md",
            color: "#FFFFFF",
            align: "center"
          },
          {
            type: "text",
            text: "แอดมินได้รับภาพเรียบร้อยครับ\nจะทำการประเมินราคาให้สักครู่นะครับ\nขอบพระคุณครับ🙏",
            wrap: true,
            size: "sm",
            color: "#E5E7EB",
            align: "center"
          }
        ]
      }
    }
  };
}

function buildContactAdminFlex() {
  return {
    type: "flex",
    altText: "ติดต่อแอดมิน",
    contents: {
      type: "bubble",
      size: "mega",
      body: {
        type: "box",
        layout: "vertical",
        backgroundColor: "#0B0B0B",
        paddingAll: "20px",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: "📞 ติดต่อแอดมิน",
            weight: "bold",
            size: "xl",
            color: "#FACC15",
            align: "center"
          },
          {
            type: "text",
            text: "พอใจ รับฝากสินค้า",
            size: "sm",
            color: "#FFFFFF",
            align: "center"
          },
          {
            type: "separator",
            color: "#C9A227",
            margin: "md"
          },
          {
            type: "text",
            text: "เบอร์โทรสอบถาม: 0615254648\nหรือลูกค้าสามารถกดปุ่มฝากสินค้า แล้วทำตามขั้นตอนได้เลยครับ",
            wrap: true,
            size: "sm",
            color: "#E5E7EB",
            align: "center"
          },
          {
            type: "button",
            style: "primary",
            color: "#FACC15",
            action: {
              type: "uri",
              label: "📞 โทร 0615254648",
              uri: "tel:0615254648"
            }
          },
          {
            type: "button",
            style: "secondary",
            action: {
              type: "uri",
              label: "📍 เปิดพิกัดร้าน",
              uri: MAP_URL
            }
          },
          {
            type: "button",
            style: "primary",
            color: "#111111",
            action: {
              type: "message",
              label: "📦 ฝากสินค้า",
              text: "#สนใจฝากสินค้า"
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

async function notifyAdmin(text) {
  if (!ADMIN_USER_ID) return;

  try {
    await client.pushMessage({
      to: ADMIN_USER_ID,
      messages: [
        {
          type: "text",
          text
        }
      ]
    });
  } catch (err) {
    console.log("แจ้งแอดมินไม่สำเร็จ:", err.message);
  }
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
      return reply(event.replyToken, buildAskPhotoFlex(
        "📱 มือถือ / แท็บเล็ต",
        "มือถือรุ่นไหนครับ",
        "รบกวนลูกค้าถ่ายรูปภาพมือถือ เพื่อให้แอดมินประเมินราคาเบื้องต้นครับ"
      ));
    }

    if (text === "ฝากสินค้า:เครื่องใช้ไฟฟ้า") {
      return reply(event.replyToken, buildAskPhotoFlex(
        "🖥️ เครื่องใช้ไฟฟ้า",
        "เครื่องใช้ไฟฟ้าชนิดใดครับ",
        "รบกวนลูกค้าถ่ายรูปภาพเครื่องใช้ไฟฟ้า เพื่อให้แอดมินประเมินราคาเบื้องต้นครับ"
      ));
    }

    if (text === "ฝากสินค้า:อื่นๆ") {
      return reply(event.replyToken, buildAskPhotoFlex(
        "💎 สินค้ามีค่าประเภทอื่นๆ",
        "สินค้ามีค่าประเภทใดครับ",
        "รบกวนลูกค้าถ่ายรูปภาพสินค้า เพื่อให้แอดมินประเมินราคาเบื้องต้นครับ"
      ));
    }

    if (text === "ติดต่อแอดมิน" || text === "#ติดต่อแอดมิน") {
      return reply(event.replyToken, buildContactAdminFlex());
    }
  }

  if (event.type === "message" && event.message.type === "image") {
    await notifyAdmin(
`📥 มีลูกค้าส่งรูปสินค้าใหม่

กรุณาตรวจสอบและประเมินราคา`
    );

    return reply(event.replyToken, buildImageReceivedFlex());
  }

  return null;
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Bot Running");
});
