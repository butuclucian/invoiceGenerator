import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    title: { type: String, default: "Analiză Financiară AI"},
    report: { type: String, required: true},
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", ReportSchema);
export default Report;