import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteRequestSchema } from "@shared/schema";
import { sendQuoteRequestEmail } from "./email";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/quote-requests", async (req, res) => {
    try {
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      const quoteRequest = await storage.createQuoteRequest(validatedData);
      
      try {
        console.log('Attempting to send email for quote request...');
        const emailResult = await sendQuoteRequestEmail({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          propertyType: validatedData.propertyType,
          message: validatedData.message,
        });
        console.log('Email sent successfully:', emailResult);
      } catch (emailError: any) {
        console.error('Error sending email:', emailError);
      }
      
      res.json(quoteRequest);
    } catch (error: any) {
      console.error('Error processing quote request:', error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/quote-requests", async (req, res) => {
    try {
      const requests = await storage.getAllQuoteRequests();
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
