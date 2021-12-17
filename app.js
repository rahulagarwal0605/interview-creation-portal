const express = require("express");
const PORT = process.env.PORT || 3000;
const path = require('path');
const adminRoutes = require("./routes/adminRoutes");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.text());

app.use("/api/admin", adminRoutes);

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname+'/client/index.html'));
});

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
