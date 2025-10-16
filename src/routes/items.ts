import { IncomingMessage, ServerResponse } from "http";
import { getItems, getItemById, addItem, updateItem } from "../controllers/items";
import { error } from "console";

export const itemsRoute = async (req: IncomingMessage, res: ServerResponse)=>{
    if(req.url?.startsWith("/items")){
       


        const parts = req.url.split("/")
        
        const id = parts[2] ? parseInt(parts[2]) : undefined

        if(req.method === 'GET' && !id)
        {
            res.writeHead(200, {'content-type': 'application/json'})
            res.end(JSON.stringify(getItems()));
            return
        }

        if (req.method === 'GET' && id){
            
            
            if(isNaN(id)){
                res.writeHead(400, {"content-type": "application/json"});
                res.end(JSON.stringify({error: "Invalid item Id"}));
                return
            }

            const song =getItemById(id);
            if(!song){
                res.writeHead(400, {"content-type": "application/json"});
                res.end(JSON.stringify({error: "item not found"}));
                return
            }

            res.writeHead(200, {'content-type':'application/json'});
            res.end(JSON.stringify(song));
            return

        }

        if(req.method === 'POST'){
            let body = ""
            req.on('data', (chunk)=> {
                console.log(chunk, "chunk");
                body+= chunk.toString();
               
            });

            req.on('end', ()=>{
                
                
                try {
                    const {name, isPurchased, quantity,price} = JSON.parse(body)
                    if(!name || typeof name !== "string"){
                        res.writeHead(400, {"content-type":"application/json"});
                        res.end(JSON.stringify({error: "item name is required"}))
                    }

                     if(typeof isPurchased ==="undefined" || typeof isPurchased !== "boolean"){
                        res.writeHead(400, {"content-type":"application/json"});
                        res.end(JSON.stringify({error: "isPurchased of the item  is required"}))
                    }

                     if(!quantity || typeof quantity !== "number"){
                        res.writeHead(400, {"content-type":"application/json"});
                        res.end(JSON.stringify({error: "quantity of item is required"}))
                    }
                    if(!price || typeof price !== "number"){
                        res.writeHead(400, {"content-type":"application/json"});
                        res.end(JSON.stringify({error: "price of item is required"}))
                    }
                    const newItem = addItem(name,isPurchased, quantity, price)
                res.writeHead(201, {"content-type": "application/json"});
                res.end(JSON.stringify(newItem));
                } catch (error) {
                    res.writeHead(400, {"content-type":"application/json"});
                        res.end(JSON.stringify({error: "Invalid JSON payload"}))
                }
            });
            return
        }


       if (req.method === "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
        const { name, quantity, price, isPurchased } = JSON.parse(body);
        if (!id || isNaN(id)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Id is required" }));
          return;
        }
        if (!name || typeof name !== "string") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Name is required" }));
          return;
        }
        if (!quantity || typeof quantity !== "number") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Quantity is required" }));
          return;
        }
        if (!price || typeof price !== "number") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Price is required" }));
          return;
        }
        if (
          typeof isPurchased === "undefined" ||
          typeof isPurchased !== "boolean"
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "isPurchased is required" }));
          return;
        }
        const updatedItem = updateItem(id, {
          name,
          quantity,
          price,
          isPurchased,
        });
        if (!updatedItem) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Item Not found" }));
          return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedItem));
        } catch (e) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Invalid JSON payload" }));
        }
      });
      return;
    }
        res.writeHead(405, {"content-type":"application/json"});
        res.end(JSON.stringify({error: "method not allowed on /items"}))
    }

};
