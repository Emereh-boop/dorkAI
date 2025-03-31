import { json } from '@sveltejs/kit';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import { createClient } from 'redis';
import dotenv from 'dotenv';

// 🔹 Load environment variables from `.env` file
dotenv.config();

// 🔹 Securely Load API Credentials
const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

// 🔹 MongoDB Setup (Persistent Storage)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'dorkyAI';
const COLLECTION_NAME = 'search_queries';

const mongoClient = new MongoClient(MONGO_URI);
await mongoClient.connect(); // 🔹 Connect to MongoDB once (avoid multiple connections)
const db = mongoClient.db(DB_NAME);
const collection = db.collection(COLLECTION_NAME);

// 🔹 Redis Setup (Caching Layer)
const redis = createClient();
await redis.connect(); // 🔹 Connect Redis once (avoid multiple connections)

/**
 * 🔹 GET API Route: Handles Search Queries
 * - Checks Redis cache first
 * - If not found, checks MongoDB for previous searches
 * - If still not found, fetches fresh data from Google API
 */
export async function GET({ url }) {
	const query = url.searchParams.get('q');

	// 🔹 Validate the input (ensure query exists)
	if (!query) {
		return json({ error: 'No query provided' }, { status: 400 });
	}

	const cacheKey = `dork:${query}`;

	try {
		// 🔹 Step 1: Check Redis Cache
		const cachedData = await redis.get(cacheKey);
		if (cachedData) {
			return json(JSON.parse(cachedData)); // Serve from cache
		}

		// 🔹 Step 2: Check MongoDB for a recent query result
		const recentQuery = await collection.findOne(
			{ query },
			{ sort: { timestamp: -1 }, projection: { results: 1, _id: 0 } }
		);
		if (recentQuery) {
			return json(recentQuery);
		}

		// 🔹 Step 3: Fetch Results from Google Custom Search API
		const response = await axios.get(
			`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}`
		);

		// 🔹 Step 4: Ensure response contains valid `items` array
		const allResults = Array.isArray(response.data.items) ? response.data.items : [];

		// 🔹 Step 5: Extract useful data & limit to 10 results
		const results = allResults.slice(0, 10).map((item) => ({
			image: item.pagemap?.cse_image || null,
			thumbnail: item.pagemap?.cse_thumbnail || null,
			metadata: item.pagemap?.metatags || null,
			title: item.title,
			htmlUrl: item.htmlFormattedUrl,
			url: item.link,
			snippet: item.snippet,
			htmlSnippet: item.htmlSnippet,
			fileType: item.fileFormat || 'N/A'
		}));

		// 🔹 Step 6: Cache Results in Redis (10 min expiration)
		await redis.setEx(cacheKey, 600, JSON.stringify({ results }));

		// 🔹 Step 7: Store in MongoDB for Analytics
		await collection.insertOne({
			query,
			results,
			timestamp: new Date()
		});

		return json({ results });
	} catch (error) {
		console.error('Error fetching search results:', error);
		return json({ error: 'Failed to fetch search results' }, { status: 500 });
	}
}
