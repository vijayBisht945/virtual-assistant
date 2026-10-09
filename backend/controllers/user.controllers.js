import User from '../models/user.model.js'
import geminiResponse from '../gemini.js'
import uploadOnCloudinary from '../config/cloudinary.js'
import moment from 'moment'

export const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(400).json({ message: "user does not exist" })
    }

    return res.status(200).json({
      message: "user access successfully",
      user
    })
  }
  catch (err) {
    return res.status(400).json({ message: "get user error" })
  }
}

export const updateAssistantImage = async (req, res) => {
  try {
    let { assistantName, imageUrl } = req.body;
    if (!assistantName?.trim()) {
      return res.status(400).json({ message: "assistant name is required" })
    }

    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path)
    } else {
      assistantImage = imageUrl
    }
    if (!assistantImage) {
      return res.status(400).json({ message: "assistant image is required" })
    }

    const user = await User.findByIdAndUpdate(req.userId, {
      assistantName,
      assistantImage
    }, { returnDocument: "after" }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "user does not exist" })
    }
    return res.status(200).json({
      message:
        "assistant image and update successfully", user
    })
  }
  catch (err) {
    console.error("Assistant update failed:", err)
    return res.status(500).json({ message: 'internal server error' });
  }

}



export const geminiGetResponse = async (req, res) => {
  try {
    const { command } = req.body;

    console.log("COMMAND:", command);

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    user.history.push(command)
    user.save()
    const assistantName = user.assistantName;
    const userName = user.name;

    console.log("BEFORE GEMINI");

    const data = await geminiResponse(
      command,
      assistantName,
      userName
    );

    console.log("AFTER GEMINI:", data);

    if (typeof data !== "string") {
      return res.status(502).json({
        message: "Gemini did not return a string"
      });
    }

    const jsonMatch = data.match(/{[\s\S]*}/);

    console.log("JSON MATCH:", jsonMatch);

    if (!jsonMatch) {
      return res.status(500).json({
        message: "No JSON found",
        raw: data
      });
    }

    let gemData;

    try {
      gemData = JSON.parse(jsonMatch[0]);

      console.log("PARSED GEM DATA:", gemData);

    } catch (error) {
      console.error("JSON PARSE ERROR:", error);

      return res.status(500).json({
        message: "JSON parsing failed",
        raw: data
      });
    }

    const type = gemData.type;

    switch (type) {

      case "get_time":
        return res.json({
          type,
          userinput: gemData.userinput,
          response: `The current time is ${moment().format("h:mm A")}`
        });

      case "get_date":
        return res.json({
          type,
          userinput: gemData.userinput,
          response: `Today is ${moment().format("DD-MM-YYYY")}`
        });

      case "get_day":
        return res.json({
          type,
          userinput: gemData.userinput,
          response: `Today is ${moment().format("dddd")}`
        });

      case "get_month":
        return res.json({
          type,
          userinput: gemData.userinput,
          response: `This is month ${moment().format("MMMM")}`
        });

      case "general":
      case "google_search":
      case "google_open":
      case "google_maps":
      case "youtube_search":
      case "youtube_play":
      case "instagram_open":
      case "calculator_open":
      case "facebook_open":
      case "weather_show":

        console.log("SENDING RESPONSE TO FRONTEND:", gemData);

        return res.json(gemData);

      default:
        return res.status(400).json({
          message: "Invalid type",
          type
        });
    }

  } catch (err) {

    console.error("🔥 CONTROLLER ERROR:", err);

    return res.status(500).json({
      message: err.message
    });
  }
}
















































































