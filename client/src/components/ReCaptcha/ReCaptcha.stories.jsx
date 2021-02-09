import React from "react";
import { ReCaptcha } from "./ReCaptcha";

export default {
  title: "ReCaptcha",
  component: ReCaptcha,
};

export const ReCaptchaStory: React.VFC<any> = () => (
  <ReCaptcha id="123" onVerifyCaptcha={() => console.log("testing")} />
);

ReCaptchaStory.storyName = "I am the ReCaptchaStory";
