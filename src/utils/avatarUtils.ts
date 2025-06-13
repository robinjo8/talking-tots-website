
export const getAvatarSrc = (avatarId: number): string => {
  const avatarImages = [
    "",
    "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png",
    "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png",
    "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png",
    "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png",
    "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png",
    "/lovable-uploads/d193f7f73319-4850-b521-25def4df4ded.png",
    "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png",
    "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png",
    "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png",
    "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png",
    "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png",
    "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png",
    "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png",
    "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png",
    "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png"
  ];

  return avatarImages[avatarId] || "";
};
