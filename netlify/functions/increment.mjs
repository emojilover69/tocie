import { Client, fql } from 'fauna';

export default async function handler(req, context) {
    const client = new Client({
        secret: Netlify.env.get("FAUNA_DB_SECRET")
    });

    try {    
        const q = fql`counters.byId("1")!.update( { count: (counters.byId("1") {count})!.count + 1 } )`;
        const resp = await client.query(q);
        client.close();
        return new Response(JSON.stringify({counter: resp.data.count}), {headers: {'content-type': 'application/json'}});
    } catch(e) {
        client.close();
        return new Response(JSON.stringify({error: true}), {status: 500, headers: {'content-type': 'application/json'}});
    }
}
