import { vi } from "vitest";

export const stripe = {
  charges: {
    create: vi.fn().mockResolvedValue({
      id: "ch_123",
      amount: 1000,
      currency: "usd",
    }),
  },
};
