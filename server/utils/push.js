import axios from "axios";

export const sendPush = async (token, title, body) => {
  try {
    await axios.post("https://exp.host/--/api/v2/push/send", {
      to: token,
      sound: "default",
      title,
      body,
    });
  } catch (err) {
    console.error("Error sending push notification:", err?.response?.data || err);
  }
};
