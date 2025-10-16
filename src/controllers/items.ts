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

export const addItem =(name:string, status:string, quantity:number, price:number): Item =>{
    const newItem: Item ={id:currentId++, name,status, quantity, price }
    Items.push(newItem)

    return newItem
}
