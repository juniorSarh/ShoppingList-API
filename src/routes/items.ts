import { IncomingMessage, ServerResponse } from "http";
import { getItems, getItemById, addItem, updateItem, deleteItem } from "../controllers/items";

const sendJSON = (res: ServerResponse, status: number, data: any) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const sendError = (res: ServerResponse, status: number, message: string) => {
  sendJSON(res, status, { message });
};

export const itemsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  if (!req.url?.startsWith("/items")) return;

  const parts = req.url.split("/");
  const id = parts[2] ? parseInt(parts[2]) : undefined;

  // GET ALL
  if (req.method === "GET" && !id) {
    return sendJSON(res, 200, getItems());
  }

  // GET BY ID
  if (req.method === "GET" && id !== undefined) {
    if (isNaN(id)) return sendError(res, 400, "Invalid item Id");

    const item = getItemById(id);
    if (!item) return sendError(res, 404, "Item not found");

    return sendJSON(res, 200, item);
  }

  // POST
  if (req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => (body += chunk.toString()));

    req.on("end", () => {
      try {
        const { name, isPurchased, quantity, price } = JSON.parse(body);

        if (!name || typeof name !== "string")
          return sendError(res, 400, "Item name is required");

        if (typeof isPurchased !== "boolean")
          return sendError(res, 400, "isPurchased is required");

        if (typeof quantity !== "number")
          return sendError(res, 400, "Quantity is required");

        if (typeof price !== "number")
          return sendError(res, 400, "Price is required");

        const newItem = addItem(name, isPurchased, quantity, price);
        return sendJSON(res, 201, newItem);
      } catch {
        return sendError(res, 400, "Invalid JSON payload");
      }
    });

    return;
  }

  // PUT
  if (req.method === "PUT") {
    let body = "";

    req.on("data", (chunk) => (body += chunk));

    req.on("end", () => {
      try {
        if (!id || isNaN(id))
          return sendError(res, 400, "Id is required");

        const { name, quantity, price, isPurchased } = JSON.parse(body);

        if (!name || typeof name !== "string")
          return sendError(res, 400, "Name is required");

        if (typeof quantity !== "number")
          return sendError(res, 400, "Quantity is required");

        if (typeof price !== "number")
          return sendError(res, 400, "Price is required");

        if (typeof isPurchased !== "boolean")
          return sendError(res, 400, "isPurchased is required");

        const updatedItem = updateItem(id, {
          name,
          quantity,
          price,
          isPurchased,
        });

        if (!updatedItem)
          return sendError(res, 404, "Item not found");

        return sendJSON(res, 200, updatedItem);
      } catch {
        return sendError(res, 400, "Invalid JSON payload");
      }
    });

    return;
  }

  // DELETE
  if (req.method === "DELETE") {
    if (!id || isNaN(id))
      return sendError(res, 400, "Id is required");

    const removed = deleteItem(id);
    if (!removed)
      return sendError(res, 404, "Item not found");

    res.writeHead(204);
    return res.end();
  }

  // METHOD NOT ALLOWED
  return sendError(res, 405, "Method not allowed on /items");
};