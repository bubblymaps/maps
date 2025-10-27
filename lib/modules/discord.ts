import fetch from "node-fetch";

export interface DiscordMessageOptions {
  username?: string;
  avatar_url?: string;
  content?: string;
  embeds?: DiscordEmbed[];
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  footer?: { text: string; icon_url?: string };
  image?: { url: string };
  thumbnail?: { url: string };
  author?: { name: string; url?: string; icon_url?: string };
  fields?: { name: string; value: string; inline?: boolean }[];
}

export class Discord {
  static async send(
    webhookUrl: string,
    options: DiscordMessageOptions
  ): Promise<void> {
    try {
      const payload = {
        username: options.username,
        avatar_url: options.avatar_url,
        content: options.content,
        embeds: options.embeds,
      };

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Discord webhook failed: ${res.status} ${text}`);
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to send Discord message");
    }
  }
}
