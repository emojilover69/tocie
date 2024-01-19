import { Client, fql } from 'fauna';

async function getCounter() {
    const client = new Client({
        secret: Netlify.env.get("FAUNA_DB_SECRET")
    });

    try {    
        const q = fql`counters.byId("1") {count}`;
        const resp = await client.query(q);
        client.close();
        return resp.data.count;
    } catch(e) {
        console.log("error getting counter:", e);
        client.close();
        return "unknown";
    }
}

export default async function handler(req, context) {
    const response = await context.next();
    const page = await response.text();

    const counterTemplate = /{{COUNTER}}/;
    const updatedPage = page.replace(counterTemplate, await getCounter());
    return new Response(updatedPage, response);
}

export const config = { path: '/' };
