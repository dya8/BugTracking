import { useEffect } from "react";

const ChatbaseBot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "hWUCPeu_cjmBo-FpDN4jN";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default ChatbaseBot;
