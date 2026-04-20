// Instagram Graph API helpers
const GRAPH = "https://graph.facebook.com/v19.0";

export async function publishToInstagram(opts: {
  igUserId: string;
  accessToken: string;
  imageUrl: string;
  caption: string;
}) {
  // 1. create container
  const createRes = await fetch(
    `${GRAPH}/${opts.igUserId}/media?image_url=${encodeURIComponent(opts.imageUrl)}&caption=${encodeURIComponent(opts.caption)}&access_token=${opts.accessToken}`,
    { method: "POST" }
  );
  const createData = await createRes.json();
  if (!createData.id) throw new Error(JSON.stringify(createData));

  // 2. publish container
  const pubRes = await fetch(
    `${GRAPH}/${opts.igUserId}/media_publish?creation_id=${createData.id}&access_token=${opts.accessToken}`,
    { method: "POST" }
  );
  const pubData = await pubRes.json();
  if (!pubData.id) throw new Error(JSON.stringify(pubData));
  return pubData.id as string;
}

export async function exchangeCodeForToken(code: string, redirectUri: string) {
  const res = await fetch(
    `${GRAPH}/oauth/access_token?client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
  );
  return res.json();
}

export async function getIgUserFromPage(accessToken: string) {
  const pages = await fetch(
    `${GRAPH}/me/accounts?access_token=${accessToken}`
  ).then((r) => r.json());
  const page = pages.data?.[0];
  if (!page) throw new Error("no facebook page");
  const ig = await fetch(
    `${GRAPH}/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
  ).then((r) => r.json());
  return {
    igUserId: ig.instagram_business_account?.id,
    pageAccessToken: page.access_token,
    pageId: page.id
  };
}
