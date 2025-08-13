import type { StoreItem } from "../types/store";

export const storeItems: StoreItem[] = [
  {
    id: "1",
    title: "Vintage Film Camera",
    description: "Rare 1960s rangefinder camera in excellent condition",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=600&h=400&fit=crop",
    category: "collectibles",
    condition: "vintage",
    seller: {
      id: "v1",
      name: "Vincent Gray",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
      rating: 4.9,
    },
    tags: ["camera", "photography", "analog", "vintage"],
    listed: "2024-03-10T12:00:00Z",
  },
  {
    id: "2",
    title: "Dark City Art Print",
    description: "Limited edition noir cityscape, signed and numbered",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1514866726862-0f081731e63f?w=600&h=400&fit=crop",
    category: "art",
    condition: "new",
    seller: {
      id: "n1",
      name: "Nina Blake",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
      rating: 4.8,
    },
    tags: ["art", "print", "cityscape", "noir"],
    listed: "2024-03-11T14:30:00Z",
  },
];
