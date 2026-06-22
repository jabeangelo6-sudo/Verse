export function generateCTA(bio: string, tags: string[] = []): string {
  const text = [...tags.map(t => t.toLowerCase()), bio.toLowerCase()].join(" ");

  if (/tech|software|code|developer|engineer|programming/.test(text))
    return "unfiltered tech takes before they hit mainstream";
  if (/financ|invest|money|trading|market|stock|crypto|defi/.test(text))
    return "raw financial insights without the sponsored garbage";
  if (/fitness|workout|gym|health|nutrition|training|athlete/.test(text))
    return "real fitness science without the supplement ads";
  if (/music|artist|producer|beat|album|song|rapper|singer/.test(text))
    return "unreleased music and behind-the-scenes process";
  if (/business|entrepreneur|startup|founder|venture|ceo/.test(text))
    return "the business strategies I can't post anywhere else";
  if (/gaming|gamer|stream|esport|game/.test(text))
    return "game analysis without the corporate sponsorship";
  if (/food|cook|recipe|chef|bake|kitchen|restaurant/.test(text))
    return "recipes and food stories before they go mainstream";
  if (/travel|adventure|explore|digital nomad|backpack/.test(text))
    return "travel discoveries before the crowds find them";
  if (/art|design|creative|illustrat|paint|photograph/.test(text))
    return "my creative process and work in progress";
  if (/write|author|writer|journalist|essay|book|newsletter/.test(text))
    return "writing I only publish here, unedited and unfiltered";
  if (/podcast|host|interview|episode|show/.test(text))
    return "exclusive clips and conversations I don't post anywhere else";
  if (/film|video|cinema|director|actor/.test(text))
    return "behind-the-scenes content and early releases";
  if (/science|research|data|analyt|academic/.test(text))
    return "research breakdowns before they're dumbed down";
  if (/fashion|style|outfit|streetwear|luxury/.test(text))
    return "style drops and fashion insights before anyone else";

  return "exclusive content I only share on Verse";
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
