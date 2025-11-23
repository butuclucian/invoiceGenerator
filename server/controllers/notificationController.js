import Notification from "../models/Notification.js";
import Invoice from "../models/Invoice.js";
import { sendPush } from "../utils/push.js"; // ✅ IMPORT PENTRU MOBILE PUSH

// =====================================================================================
// ✅ Creează notificări pentru facturile near due + TRIMITE PUSH PE MOBIL
// =====================================================================================
export const generateNearDueNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // 📅 Azi și mâine
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // 🕐 Normalizează la zi
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

    // 🔍 Facturile near-due
    const nearDueInvoices = await Invoice.find({
      user: userId,
      status: { $ne: "paid" },
      due_date: { $gte: startOfToday, $lte: endOfTomorrow },
    }).populate("client");

    const created = [];

    for (const inv of nearDueInvoices) {
      const existing = await Notification.findOne({
        user: userId,
        invoice: inv._id,
        message: { $regex: inv.invoice_number, $options: "i" },
      });

      if (!existing) {
        const dueText =
          new Date(inv.due_date).toDateString() ===
          new Date().toDateString()
            ? "is due today!"
            : "is due within 24 hours!";

        // 📩 Mesajul notificării
        const message = `Invoice ${inv.invoice_number} for ${
          inv.client?.name || "Unknown Client"
        } ${dueText}`;

        // === CREATE NOTIFICATION IN DATABASE ===
        const note = await Notification.create({
          user: userId,
          invoice: inv._id,
          message,
        });

        created.push(note);

        // === SEND PUSH NOTIFICATION TO MOBILE ===
        if (req.user.pushToken) {
          await sendPush(
            req.user.pushToken,
            "Invoice Reminder",
            message
          );
        }
      }
    }

    res.status(200).json({ success: true, created });
  } catch (error) {
    console.error("❌ Error generating notifications:", error);
    res.status(500).json({ message: "Failed to generate notifications" });
  }
};

// =====================================================================================
// ✅ Obține toate notificările utilizatorului
// =====================================================================================
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate({
        path: "invoice",
        select: "invoice_number total due_date status",
        populate: { path: "client", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// =====================================================================================
// ✅ Marchează toate notificările ca citite
// =====================================================================================
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id }, { read: true });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};


// =====================================================================================
// 🚀 TEST PUSH NOTIFICATION
// =====================================================================================
export const testPushNotification = async (req, res) => {
  try {
    const token = req.user.pushToken;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User does not have a push token saved.",
      });
    }

    await sendPush(
      token,
      "📱 Push Test",
      "Your mobile push notifications are working!"
    );

    res.status(200).json({ success: true, message: "Push sent!" });
  } catch (error) {
    console.error("❌ Error sending test push:", error);
    res.status(500).json({ success: false, message: "Failed to send push" });
  }
};