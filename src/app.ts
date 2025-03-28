import express from 'express';
import walletRoutes from './routes/walletRoutes';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount wallet routes at /wallet
app.use('/wallet', walletRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Root route to display a simple HTML page for testing
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>Multi-Signature Wallet Simulator</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #333; }
                    button { margin: 5px; padding: 10px 15px; font-size: 16px; }
                    pre { background: #f4f4f4; padding: 10px; }
                </style>
            </head>
            <body>
                <h1>Multi-Signature Wallet Simulator</h1>
                <button id="createBtn">Create Wallet</button>
                <button id="getBtn" style="display:none;">Get Wallet Details</button>
                <pre id="result"></pre>
                <script>
                    let walletId = '';
                    document.getElementById('createBtn').addEventListener('click', async () => {
                        const response = await fetch('/wallet', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                owners: ['owner1', 'owner2'],
                                requiredSignatures: 2
                            })
                        });
                        const data = await response.json();
                        walletId = data.id;
                        document.getElementById('result').innerText = JSON.stringify(data, null, 2);
                        document.getElementById('getBtn').style.display = 'inline-block';
                    });
                    document.getElementById('getBtn').addEventListener('click', async () => {
                        if (!walletId) return alert('No wallet id available.');
                        const response = await fetch('/wallet/' + walletId);
                        const data = await response.json();
                        document.getElementById('result').innerText = JSON.stringify(data, null, 2);
                    });
                </script>
            </body>
        </html>
    `);
});