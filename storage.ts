import { type QuoteRequest, type InsertQuoteRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest>;
  getAllQuoteRequests(): Promise<QuoteRequest[]>;
}

export class MemStorage implements IStorage {
  private quoteRequests: Map<string, QuoteRequest>;

  constructor() {
    this.quoteRequests = new Map();
  }

  async createQuoteRequest(insertRequest: InsertQuoteRequest): Promise<QuoteRequest> {
    const id = randomUUID();
    const quoteRequest: QuoteRequest = { 
      ...insertRequest,
      phone: insertRequest.phone ?? null,
      propertyType: insertRequest.propertyType ?? null,
      message: insertRequest.message ?? null,
      id,
      createdAt: new Date()
    };
    this.quoteRequests.set(id, quoteRequest);
    return quoteRequest;
  }

  async getAllQuoteRequests(): Promise<QuoteRequest[]> {
    return Array.from(this.quoteRequests.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
