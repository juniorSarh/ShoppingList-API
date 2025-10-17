import http, {IncomingMessage, ServerResponse} from 'http'
import { server } from 'typescript';
import { itemsRoute } from './routes/items';
import { error } from 'console';

const PORT = 3000;

const requestListerner = (req: IncomingMessage, res:ServerResponse) =>{
    if(req.url?.startsWith("/items")){
        itemsRoute(req, res)
    }
    else{

        res.writeHead(404,{"content-type": "application/json"});
        res.end(JSON.stringify({message:"404 item not found"}));
    }
}

const Server = http.createServer(requestListerner)

Server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

