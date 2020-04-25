import sgMail from "@sendgrid/mail";

import type { SendEmailResponse } from "./types";

type SendOptions = {
  to: string;
  from: string;
  subject: string;
  text: string;
};

declare interface Email {
  send: (sendOptions: SendOptions) => Promise<SendEmailResponse>;
}

const Email: Email = {
  send: async (sendOptions: SendOptions): Promise<SendEmailResponse> => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    try {
      await sgMail.send({
        ...sendOptions,
        mailSettings: {
          sandboxMode: {
            enable: process.env.NODE_ENV !== "production",
          },
        },
      });
    } catch (error) {
      console.error(error);

      const responseBody = error.response.body || { errors: ["Unknown error"] };
      const errorMessages = JSON.stringify(responseBody.errors);

      return { status: "failure", message: errorMessages };
    }

    return { status: "success", message: "Email was sent" };
  },
};

export default Email;