import { nanoid } from "nanoid";
import { resend } from "@jobs/utils/resend";
import { render } from "@react-email/render";
import { schemaTask } from "@trigger.dev/sdk";
import { WaitlistJoinedPayloadSchema } from "@jobs/schema";
import { WaitlistWelcomeEmail } from "@useticketeur/email/emails/wait-list";

export const sendWaitlistEmail: unknown = schemaTask({
  id: "send-waitlist-email",
  schema: WaitlistJoinedPayloadSchema,
  maxDuration: 30,
  queue: {
    concurrencyLimit: 10,
  },
  run: async ({ name, email }) => {
    const html = await render(WaitlistWelcomeEmail({ name }));
    const { data, error } = await resend.emails.send({
      headers: {
        "X-Entity-Ref-ID": nanoid(),
      },
      from: "Ticketeur <noreply@useticketeur.com>",
      to: [email],
      subject: "Welcome to the Ticketeur Waitlist!",
      html,
    });

    if (error) {
      throw error;
    }
    return { success: true, data };
  },
});