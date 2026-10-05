const express = require("express");
const paystackService = require("../services/paystackService");

const router = express.Router();

router.post("/initialize", async (req, res) => {
  try {
    const {
      email,
      amount,
      reference,
      callback_url,
    } = req.body;

    if (!email || !amount || !reference) {
      return res.status(400).json({
        message: "Email, amount and reference are required",
      });
    }

    const result = await paystackService.initializeTransaction({
      email,
      amount,
      reference,
      callback_url,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Paystack initialization error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Unable to initialize payment",
    });
  }
});


router.get("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const result =
      await paystackService.verifyTransaction(reference);

    res.status(200).json(result);
  } catch (error) {
    console.error(
      "Paystack verification error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Unable to verify payment",
    });
  }
});


module.exports = router;