const Stripe = require("stripe");
const Plan = require("../models/planModel");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PDFDocument = require("pdfkit");
const fs = require("fs");
const Booking = require("../models/booking");
const User = require("../models/userModel");

exports.generateInvoice = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Find the booking using payment ID
    const booking = await Booking.findOne({
      "paymentInfo.id": paymentId,
    }).populate("planId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    const filePath = `./invoices/invoice_${paymentId}.pdf`;
    const invoiceUrl = `/invoices/invoice_${paymentId}.pdf`; // This will be stored in the database

    // Generate PDF
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(16).text("Invoice", { align: "center" });
    doc.text(`Booking ID: ${booking._id}`);
    doc.text(`Plan Name: ${booking.planId.planName}`);
    doc.text(`Price: $${booking.amountPaid}`);
    doc.text(`Payment Status: ${booking.paymentInfo.status}`);
    doc.text(`Date: ${new Date().toLocaleString()}`);
    doc.end();

    // Save the invoice URL in the booking
    booking.invoiceUrl = invoiceUrl;
    await booking.save();

    res
      .status(200)
      .json({ message: "Invoice generated successfully.", invoiceUrl });
  } catch (err) {
    console.error("Error generating invoice:", err.message);
    res.status(500).json({ message: "Failed to generate invoice." });
  }
};

exports.createPaymentIntent = async (req, res) => {
  try {
    const { planId } = req.body;

    // Validate the plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.price * 100, // Stripe expects amount in cents
      currency: "usd",
      metadata: {
        planId: plan._id.toString(),
        userId: req.user.id,
      },
    });

    res.status(200).json({
      clientSecret:
        "sk_test_51QPxa2L1athdecW2ekuyktRC5q0y4KJa6Sspn0QPURjvA15RFIzg6adVlJfncWM0tyWRI68pYQ48boNWIkuQDifO006D6VfiFU",
    });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).json({ message: "Failed to create payment intent." });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { planId, startDate, duration, durationType } = req.body;

    // Validate the plan
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    if (plan.discontinued) {
      return res.status(400).json({
        message: "This plan is discontinued and cannot be purchased.",
      });
    }

    // Calculate total price based on duration type
    let totalPrice;
    if (durationType === "yearly") {
      totalPrice = plan.price * 12 * duration * 0.9; // 10% discount
    } else {
      totalPrice = plan.price * duration; // Monthly price
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.planName,
              description: plan.description,
            },
            unit_amount: Math.round(totalPrice * 100), // Amount in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
      metadata: {
        planId: plan._id.toString(),
        userId: req.user.id,
        startDate,
        duration,
        durationType,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    res.status(500).json({ message: "Failed to create checkout session." });
  }
};

exports.stripeWebhook = async (req, res) => {
  //   console.log("Received headers:", req.headers);
  //   console.log("Raw body received:", req.body.toString());

  const sig = req.headers["stripe-signature"]; // Retrieve the signature from the headers
  console.log("Received webhook event. Signature:", sig);
  let event;

  try {
    // Verify the webhook event using the raw body and signature
    event = stripe.webhooks.constructEvent(
      req.body, // Raw body (buffer)
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Webhook event verified:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the specific event types
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout session metadata:", session.metadata);

    try {
      const planId = session.metadata.planId; // Retrieve plan ID from metadata
      const userId = session.metadata.userId; // Retrieve user ID from metadata

      console.log("Plan ID:", planId);
      console.log("User ID:", userId);

      // Fetch the plan details from the database
      const plan = await Plan.findById(planId);
      if (!plan) {
        console.error("Plan not found for webhook session.");
        return res.status(404).send("Plan not found.");
      }
      let totalPrice;
      if (session.metadata.durationType === "yearly") {
        totalPrice = plan.price * 12 * session.metadata.duration * 0.9; // 10% discount for yearly
      } else {
        totalPrice = plan.price * session.metadata.duration; // Monthly price
      }

      // Create a booking in the database
      const booking = await Booking.create({
        userId,
        planId,
        amountPaid: totalPrice,
        paymentInfo: {
          id: session.payment_intent,
          status: "succeeded",
        },
        paidAt: new Date(),
      });

      console.log("Booking created successfully:", booking);

      // Generate an invoice as a PDF
      const filePath = `./invoices/invoice_${booking._id}.pdf`;
      const invoiceUrl = `/invoices/invoice_${booking._id}.pdf`;

      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      // Fetch user details (Assuming `user` is fetched based on `userId`)
      const user = await User.findById(userId); // Ensure User model is imported // Ensure User model is imported
      const { name, email, phone } = user || {};

      // Determine duration label
      const durationLabel =
        session.metadata.durationType === "yearly"
          ? `${session.metadata.duration} year(s)`
          : `${session.metadata.duration} month(s)`;

      // Pipe to write the invoice to a file
      doc.pipe(fs.createWriteStream(filePath));

      // Add company name
      doc
        .fontSize(20)
        .text("Campus Vitality™", 160, 60, { align: "left" })
        .moveDown();

      // Add invoice header
      doc.fontSize(16).text("Invoice", { align: "center" }).moveDown();

      // Add user details
      doc
        .fontSize(12)
        .text("Customer Details", { underline: true, align: "left" })
        .moveDown()
        .text("Name:", 50, doc.y)
        .text(name || "N/A", 150, doc.y)
        .moveDown()
        .text("Email:", 50, doc.y)
        .text(email || "N/A", 150, doc.y)
        .moveDown()
        .text("Phone:", 50, doc.y)
        .text(phone || "N/A", 150, doc.y)
        .moveDown(2);

      // Add booking details
      doc
        .fontSize(12)
        .text("Booking Details", { underline: true, align: "left" })
        .moveDown();

      doc
        .fontSize(12)
        .text("Booking ID:", 50, doc.y)
        .text(`${booking._id}`, 150, doc.y);

      doc
        .moveDown()
        .text("Plan Name:", 50, doc.y)
        .text(`${plan.planName}`, 150, doc.y);

      doc
        .moveDown()
        .text("Plan Service Provider :", 50, doc.y)
        .text(`${plan.serviceProvider}`, 150, doc.y);

      doc
        .moveDown()
        .text("Price:", 50, doc.y)
        .text(`$${plan.price}`, 150, doc.y);

      doc
        .moveDown()
        .text("Payment Status:", 50, doc.y)
        .text("Succeeded", 150, doc.y);

      doc
        .moveDown()
        .text("Invoice Date:", 50, doc.y)
        .text(new Date().toLocaleString(), 150, doc.y);

      doc
        .moveDown()
        .text("Start Date:", 50, doc.y)
        .text(`${session.metadata.startDate}`, 150, doc.y);

      doc
        .moveDown()
        .text("Duration:", 50, doc.y)
        .text(`${durationLabel}`, 150, doc.y);

      doc
        .moveDown()
        .text("Total Paid:", 50, doc.y)
        .text(`$${totalPrice}`, 150, doc.y)
        .moveDown();

      // Add footer note
      doc
        .moveDown(2)
        .fontSize(10)
        .text(
          "Your insurance copy will be sent by the concerned company in 2-3 working days.",
          { align: "center" }
        );

      // Finalize the document
      doc.end();

      // Save the invoice URL in the booking record
      booking.invoiceUrl = invoiceUrl;
      await booking.save();

      console.log("Invoice generated successfully.");
    } catch (err) {
      console.error("Error processing checkout session:", err.message);
      return res.status(500).send("Internal Server Error.");
    }
  }

  // Acknowledge receipt of the event to Stripe
  res.status(200).send("Webhook received.");
};
