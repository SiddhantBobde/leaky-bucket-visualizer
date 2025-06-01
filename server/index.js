// Leaky Bucket Algorithm
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let bucketSize = 5; // Maximum tokens in bucket
let tokens = bucketSize; // Current tokens
let leakRate = 1; // Leak 1 token per second
let lastChecked = Date.now();

function leakyBucketMiddleware(req, res, next) {
	// Skip middleware for the config endpoint
	if (req.path === '/config') {
		return next();
	}

	const now = Date.now();
	const elapsed = (now - lastChecked) / 1000;
	lastChecked = now;

	// Refill tokens based on leak rate and elapsed time
	tokens += elapsed * leakRate;
	console.log('tokens', tokens);
	if (tokens > bucketSize) {
		tokens = bucketSize;
	}

	if (tokens >= 1) {
		tokens--;
		next();
	} else {
		res.status(429).send('Too many requests. Please try again later.');
	}
}

app.use(leakyBucketMiddleware);

app.get('/send', (req, res) => {
	res.json({ success: true, tokens });
});

app.post('/config', (req, res) => {
	const { bucketSize: newBucketSize, leakRate: newLeakRate } = req.body;

	if (typeof newBucketSize !== 'number' || typeof newLeakRate !== 'number') {
		return res.status(400).json({ error: 'Invalid input. Bucket size and leak rate must be numbers.' });
	}

	if (newBucketSize <= 0 || newLeakRate <= 0) {
		return res.status(400).json({ error: 'Bucket size and leak rate must be positive numbers.' });
	}

	// Update configuration
	bucketSize = newBucketSize;
	leakRate = newLeakRate;

	// Ensure tokens don't exceed new bucket size
	tokens = Math.min(tokens, bucketSize);

	console.log(`Configuration updated: bucketSize=${bucketSize}, leakRate=${leakRate}`);

	res.json({
		success: true,
		bucketSize,
		leakRate,
		tokens,
	});
});

app.listen(3000, function () {
	console.log('Leaky bucket server running on port 3000');
});
