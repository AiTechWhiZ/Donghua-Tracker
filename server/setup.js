const fs = require("fs");
const path = require("path");

const envContent = `NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/donghua-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
`;

const envPath = path.join(__dirname, ".env");

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log("✅ .env file created successfully!");
  console.log(
    "⚠️  Please update the JWT_SECRET and MONGO_URI in the .env file before running the application."
  );
} else {
  console.log("ℹ️  .env file already exists.");
}

console.log("\n📋 Next steps:");
console.log("1. Make sure MongoDB is running");
console.log("2. Update the .env file with your MongoDB connection string");
console.log("3. Change the JWT_SECRET to a secure random string");
console.log(
  '4. Run "npm run dev" from the root directory to start both client and server'
);
