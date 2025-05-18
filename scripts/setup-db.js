const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Setting up the database...")

// Check if .env file exists
const envPath = path.join(__dirname, "..", ".env")
if (!fs.existsSync(envPath)) {
  console.log("Creating .env file with database connection...")
  const envContent = `DATABASE_URL="postgresql://postgres:namit2424@localhost:5432/fitness_tracker"
JWT_SECRET="your_jwt_secret_key"`
  fs.writeFileSync(envPath, envContent)
  console.log(".env file created successfully!")
}

try {
  // Generate Prisma client first
  console.log("Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  // Run Prisma migrations
  console.log("Running Prisma migrations...")
  execSync("npx prisma migrate dev --name init", { stdio: "inherit" })

  // Run the database initialization script
  console.log("Initializing database with seed data...")
  execSync("node -r ts-node/register scripts/init-db.ts", { stdio: "inherit" })

  console.log("Database setup completed successfully!")
} catch (error) {
  console.error("Error setting up database:", error)
  process.exit(1)
}

