import type { Creator } from "../creator/types";

// Top creators with established following
export const topCreators: Creator[] = [
  {
    id: "1",
    name: "Vincent Gray",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    profession: "Street Photographer",
    content: {
      photography: 90,
      filmmaking: 70,
      music: 30,
      visualArts: 85,
      writing: 60,
      performance: 40,
    },
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=400&fit=crop",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&h=400&fit=crop",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop",
      },
    ],
  },
  {
    id: "2",
    name: "Nina Blake",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    profession: "Jazz Musician",
    content: {
      photography: 40,
      filmmaking: 50,
      music: 95,
      visualArts: 60,
      writing: 75,
      performance: 90,
    },
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop",
      },
    ],
  },
];

// New emerging creators
export const newCreators: Creator[] = [
  {
    id: "3",
    name: "Marcus Stone",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop",
    profession: "Film Director",
    content: {
      photography: 75,
      filmmaking: 95,
      music: 60,
      visualArts: 80,
      writing: 70,
      performance: 65,
    },
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=400&fit=crop",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=400&fit=crop",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
      },
    ],
  },
  {
    id: "4",
    name: "Clara Night",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
    profession: "Digital Artist",
    content: {
      photography: 65,
      filmmaking: 70,
      music: 40,
      visualArts: 95,
      writing: 55,
      performance: 30,
    },
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=400&h=400&fit=crop",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=400&fit=crop",
      },
    ],
  },
];
