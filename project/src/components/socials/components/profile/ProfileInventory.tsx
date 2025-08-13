import React, { useState } from "react";
import {
  Package,
  Shield,
  Palette,
  Sparkles,
  Loader2,
  Star,
} from "lucide-react";
import type { InventoryItem } from "../../lib/profileQueries";

interface ProfileInventoryProps {
  inventory: InventoryItem[];
  onInventoryUpdate: (item: InventoryItem) => void;
  loading: boolean;
}

export const ProfileInventory: React.FC<ProfileInventoryProps> = ({
  inventory,
  onInventoryUpdate,
  loading,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const categories = [
    { id: "all", name: "All Items", icon: Package },
    { id: "collectible", name: "Collectibles", icon: Package },
    { id: "badge", name: "Badges", icon: Shield },
    { id: "theme", name: "Themes", icon: Palette },
    { id: "effect", name: "Effects", icon: Sparkles },
  ];

  const filteredInventory =
    selectedCategory === "all"
      ? inventory
      : inventory.filter((item) => item.item_type === selectedCategory);

  const groupedInventory = categories.reduce((acc, category) => {
    if (category.id === "all") return acc;
    acc[category.id] = inventory.filter(
      (item) => item.item_type === category.id
    );
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  const handleEquipItem = async (item: InventoryItem) => {
    // In a real implementation, you'd call the API to update the item
    const updatedItem = { ...item, is_equipped: !item.is_equipped };
    onInventoryUpdate(updatedItem);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <category.icon className="w-4 h-4" />
            <span>{category.name}</span>
            {category.id !== "all" && (
              <span className="bg-zinc-700 text-xs px-2 py-1 rounded-full">
                {groupedInventory[category.id]?.length || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metallic-shine rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {inventory.length}
          </div>
          <div className="text-sm text-zinc-400">Total Items</div>
        </div>
        <div className="metallic-shine rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {inventory.filter((item) => item.is_equipped).length}
          </div>
          <div className="text-sm text-zinc-400">Equipped</div>
        </div>
        <div className="metallic-shine rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {
              inventory.filter((item) => item.item_rarity === "legendary")
                .length
            }
          </div>
          <div className="text-sm text-zinc-400">Legendary</div>
        </div>
        <div className="metallic-shine rounded-lg p-4">
          <div className="text-2xl font-bold text-white">
            {inventory.filter((item) => item.item_rarity === "epic").length}
          </div>
          <div className="text-sm text-zinc-400">Epic</div>
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredInventory.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredInventory.map((item) => (
            <InventoryItemCard
              key={item.id}
              item={item}
              onEquip={() => handleEquipItem(item)}
              onSelect={() => setSelectedItem(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400 text-lg mb-2">
            {selectedCategory === "all"
              ? "No items in your inventory yet"
              : `No ${selectedCategory} items found`}
          </p>
          <p className="text-zinc-500 text-sm">
            Complete achievements and participate in events to earn items!
          </p>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onEquip={() => handleEquipItem(selectedItem)}
        />
      )}
    </div>
  );
};

const InventoryItemCard = ({
  item,
  onEquip,
  onSelect,
}: {
  item: InventoryItem;
  onEquip: () => void;
  onSelect: () => void;
}) => (
  <div
    className={`bg-zinc-900 rounded-lg p-3 border transition-all cursor-pointer hover:scale-105 ${
      item.is_equipped
        ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
        : "border-zinc-800 hover:border-zinc-700"
    }`}
    onClick={onSelect}
  >
    <div className="relative">
      <img
        src={
          item.item_image_url ||
          `https://images.unsplash.com/photo-1518435485909-c96c945a73c2?w=200&h=200&fit=crop`
        }
        alt={item.item_name}
        className="w-full aspect-square object-cover rounded-lg mb-2"
      />
      {item.is_equipped && (
        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
          Equipped
        </div>
      )}
      <div className="absolute bottom-2 left-2">
        <RarityBadge rarity={item.item_rarity} />
      </div>
    </div>

    <div className="space-y-1">
      <div className="text-sm text-zinc-300 font-medium truncate">
        {item.item_name}
      </div>
      <div className="text-xs text-zinc-500 capitalize">{item.item_type}</div>
      <div className="text-xs text-zinc-400">
        {new Date(item.acquired_at).toLocaleDateString()}
      </div>
    </div>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onEquip();
      }}
      className={`w-full mt-2 px-3 py-1 rounded text-xs transition-colors ${
        item.is_equipped
          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
      }`}
    >
      {item.is_equipped ? "Unequip" : "Equip"}
    </button>
  </div>
);

const RarityBadge = ({ rarity }: { rarity: string }) => {
  const rarityConfig = {
    common: { color: "text-zinc-400", bg: "bg-zinc-700", stars: 1 },
    rare: { color: "text-blue-400", bg: "bg-blue-900/50", stars: 2 },
    epic: { color: "text-purple-400", bg: "bg-purple-900/50", stars: 3 },
    legendary: { color: "text-amber-400", bg: "bg-amber-900/50", stars: 4 },
  };

  const config =
    rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.common;

  return (
    <div
      className={`${config.bg} ${config.color} px-2 py-1 rounded-full text-xs flex items-center space-x-1`}
    >
      <div className="flex">
        {Array.from({ length: config.stars }).map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-current" />
        ))}
      </div>
    </div>
  );
};

const ItemDetailModal = ({
  item,
  onClose,
  onEquip,
}: {
  item: InventoryItem;
  onClose: () => void;
  onEquip: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-zinc-900 rounded-lg p-6 max-w-md w-full">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl text-white font-medium">{item.item_name}</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-white">
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <img
          src={
            item.item_image_url ||
            `https://images.unsplash.com/photo-1518435485909-c96c945a73c2?w=400&h=400&fit=crop`
          }
          alt={item.item_name}
          className="w-full aspect-square object-cover rounded-lg"
        />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-zinc-400">Type:</span>
            <span className="text-white ml-2 capitalize">{item.item_type}</span>
          </div>
          <div>
            <span className="text-zinc-400">Rarity:</span>
            <span className="ml-2">
              <RarityBadge rarity={item.item_rarity} />
            </span>
          </div>
          <div>
            <span className="text-zinc-400">Acquired:</span>
            <span className="text-white ml-2">
              {new Date(item.acquired_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-zinc-400">Status:</span>
            <span
              className={`ml-2 ${
                item.is_equipped ? "text-emerald-400" : "text-zinc-400"
              }`}
            >
              {item.is_equipped ? "Equipped" : "Not Equipped"}
            </span>
          </div>
        </div>

        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <div>
            <h4 className="text-sm text-zinc-400 mb-2">Details:</h4>
            <div className="bg-zinc-800/50 rounded p-3 text-sm">
              {Object.entries(item.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-zinc-400 capitalize">{key}:</span>
                  <span className="text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onEquip}
          className={`w-full px-4 py-2 rounded-lg transition-colors ${
            item.is_equipped
              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
              : "bg-zinc-800 hover:bg-zinc-700 text-white"
          }`}
        >
          {item.is_equipped ? "Unequip Item" : "Equip Item"}
        </button>
      </div>
    </div>
  </div>
);
