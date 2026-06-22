export function generateCTA(bio: string, tags: string[] = []): string {
  const text = [...tags.map(t => t.toLowerCase()), bio.toLowerCase()].join(" ");

  if (/tech|software|code|developer|engineer|programming/.test(text))
    return "unfiltered tech takes you won't find anywhere else";
  if (/financ|invest|money|trading|market|stock|crypto|defi/.test(text))
    return "raw financial insights, no sponsors, no fluff";
  if (/fitness|workout|gym|health|nutrition|training|athlete/.test(text))
    return "real fitness content without the supplement ads";
  if (/music|artist|producer|beat|album|song|rapper|singer/.test(text))
    return "unreleased music and behind-the-scenes process";
  if (/business|entrepreneur|startup|founder|venture|ceo/.test(text))
    return "business strategies I only share here";
  if (/gaming|gamer|stream|esport|game/.test(text))
    return "honest game content, no brand deals";
  if (/food|cook|recipe|chef|bake|kitchen|restaurant/.test(text))
    return "recipes and food stories I only post here";
  if (/travel|adventure|explore|digital nomad|backpack/.test(text))
    return "travel content without the tourist-trap filters";
  if (/art|design|creative|illustrat|paint|photograph/.test(text))
    return "my creative process, uncut";
  if (/write|author|writer|journalist|essay|book|newsletter/.test(text))
    return "writing I publish here first, unedited";
  if (/podcast|host|interview|episode|show/.test(text))
    return "exclusive clips I don't post anywhere else";
  if (/film|video|cinema|director|actor/.test(text))
    return "behind-the-scenes content you won't see on YouTube";
  if (/science|research|data|analyt|academic/.test(text))
    return "research breakdowns without the jargon";
  if (/fashion|style|outfit|streetwear|luxury/.test(text))
    return "style content I only drop here";

  return "content I only share on Verse";
}

export function buildShareText(
  postContent: string,
  username: string,
  bio: string,
  tags: string[] = [],
  maxContentLength = 220
): string {
  const cta = generateCTA(bio, tags);
  const truncated = postContent.length > maxContentLength
    ? postContent.slice(0, maxContentLength).trimEnd() + "…"
    : postContent;
  return `${truncated}\n\nFollow me on Verse for ${cta} → verse.app/@${username}`;
}
