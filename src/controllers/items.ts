import { Item } from "../types/items";

let Items: Item[] = [];

let currentId = 1;

export const getItems =(): Item[] =>{
    return Items;
};

export const getItemById = (id:number): Item | undefined => {
    const Item = Items.find((Item)=> Item.id === id)
    return Item
}

export const addItem =(name:string, isPurchased:boolean, quantity:number, price:number): Item =>{
    const newItem: Item ={id:currentId++, name,isPurchased, quantity, price }
    Items.push(newItem)

    return newItem
}

export const updateItem = (id: number, updatedItem: Partial<Item>): Item | undefined => {
  const item = Items.find((i) => i.id === id);
  if (!item) {
    return undefined;
  }
  if (typeof updatedItem.name === "string") item.name = updatedItem.name;
  if (typeof updatedItem.quantity === "number") item.quantity = updatedItem.quantity;
  if (typeof updatedItem.price === "number") item.price = updatedItem.price;
  if (typeof updatedItem.isPurchased === "boolean") item.isPurchased = updatedItem.isPurchased;
  return item;
};


