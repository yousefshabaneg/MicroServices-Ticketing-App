import { vi } from "vitest";

export const natsWrapper = {
  client: {
    publish: vi
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
