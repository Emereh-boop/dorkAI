import { json } from '@sveltejs/kit';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'dorkyAI';
const COLLECTION_NAME = 'search_queries';

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db(DB_NAME);
const collection = db.collection(COLLECTION_NAME);

export async function GET({ url }) {
    const query = url.searchParams.get('q');

    if (!query) {
        return json({ suggestions: [] });
    }

    try {
        const suggestions = await collection
            .find({ query: new RegExp(query, 'i') })
            .limit(20)
            .toArray();

        return json({ suggestions: suggestions.map(s => s.query) });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return json({ error: 'Failed to fetch suggestions' }, { status: 500 });
    }
}
