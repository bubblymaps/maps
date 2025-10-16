import { log } from "@/lib/pino"

export interface DiscordEmbedField 
{
    name: string;
    value: string;
    inline?: boolean;
}

export interface DiscordEmbed 
{
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    timestamp?: string;
    footer?: { text: string; icon_url?: string };
    image?: { url: string };
    thumbnail?: { url: string };
    author?: { name: string; url?: string; icon_url?: string };
    fields?: DiscordEmbedField[];
}

export interface DiscordWebhookOptions 
{
    content?: string;
    username?: string;
    avatar_url?: string;
    tts?: boolean;
    embeds?: DiscordEmbed[];
}

export class DiscordWebhook 
{
    private webhookUrl: string;

    constructor(webhookUrl: string) 
    {
        this.webhookUrl = webhookUrl;
    }

    async send(options: DiscordWebhookOptions) 
    {
        const payload = {
            content: options.content,
            username: options.username,
            avatar_url: options.avatar_url,
            tts: options.tts,
            embeds: options.embeds,
        };

        const res = await fetch(this.webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        log.warn(payload, `Sent discord message: ${res.status}`)

        if (!res.ok) {
            const text = await res.text();
            log.error({payload, res}, `Failed to send discord webhook message: ${res.status}, ${text}`)
            throw new Error(`Failed to send message! (${res.status} ${text})`);
        }

        return 204;
    }

    static createEmbed(embed: DiscordEmbed): DiscordEmbed 
    {
        return embed;
    }
}
