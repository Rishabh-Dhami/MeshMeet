const { mongoose, Schema } = require("mongoose");

const meetingSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  meetingCode: {
    type: String,
    required: [true, "Meeting code is required!"],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, "Date is required!"],
  },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = { Meeting };
