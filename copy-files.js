const fs = require("fs-extra");
const path = require("path");

// Define paths
const standalonePath = path.join(__dirname, ".next", "standalone");
const publicPath = path.join(__dirname, "public");
const nextStaticPath = path.join(__dirname, ".next", "static");

// Ensure directories exist
fs.ensureDirSync(path.join(standalonePath, "public"));
fs.ensureDirSync(path.join(standalonePath, ".next", "static"));

// Copy `.env.example` to `.next/standalone/.env`
const envFile = path.join(__dirname, ".env.example");
const envDest = path.join(standalonePath, ".env");

if (fs.existsSync(envFile)) {
    fs.copyFileSync(envFile, envDest);
} else {
    console.warn(".env.example file not found!");
}

// Copy `public/*` to `.next/standalone/public/`
fs.copySync(publicPath, path.join(standalonePath, "public"));

// Copy `.next/static/*` to `.next/standalone/.next/static/`
fs.copySync(nextStaticPath, path.join(standalonePath, ".next", "static"));

console.log("✅ Copying files completed!");
