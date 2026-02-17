# Running the TodoApp

## Prerequisites
- .NET 8 SDK
- Node.js (16+ or 18+ LTS) and `npm`
- (Optional) Angular CLI for local convenience

## Install client dependencies
Run from repository root:

```powershell
cd todoapp.client
npm install
cd ..
```

## Trust ASP.NET Core dev certificate (one-time on Windows)

```powershell
dotnet dev-certs https --trust
```

## Run the server (recommended)
The ASP.NET backend is configured to use SpaProxy and will launch the Angular dev server automatically.

From repository root:

```powershell
dotnet restore
dotnet build
dotnet run --project TodoApp.Server
```

SpaProxy will run `npm start` in the `todoapp.client` folder and proxy to `https://localhost:4200`.

## Run the client separately
If you prefer to run the frontend independently (useful for frontend debugging):

```powershell
cd todoapp.client
npm start
```

On Windows `npm start` runs the `start:windows` script which uses local ASP.NET dev cert files.

## Run tests

```powershell
dotnet test
```

## Notes
- SPA proxy settings live in `TodoApp.Server.csproj` (SpaRoot, SpaProxyLaunchCommand).
- If `npm start` fails due to missing SSL certs, re-run `dotnet dev-certs https --trust` and retry.
- To run from Visual Studio: open `TodoApp.sln`, set `TodoApp.Server` as the startup project, and run; the SPA proxy will launch the Angular dev server automatically.

---
File created to collect run instructions; adapt commands as needed for non-Windows environments.

## Troubleshooting: "There was an error exporting the HTTPS developer certificate"

If you see an error like:

```
ERROR: Exception in Command Processing for EventSource Dotnet-dev-certs: Event WslWindowsTrustSucceeded was assigned event ID 115 but 113 was passed to WriteEvent.
There was an error exporting the HTTPS developer certificate to a file. Please create the target directory before exporting.
```

1) Quick fix — create the target directory and re-run `npm start` from the client:

```powershell
$certDir = "$env:APPDATA\ASP.NET\https"
if (-not (Test-Path $certDir)) { New-Item -ItemType Directory -Path $certDir -Force }
cd todoapp.client
npm start
```

2) Manually export the PEM/key and trust the cert (one-time per machine):

```powershell
dotnet dev-certs https --export-path "$env:APPDATA\ASP.NET\https\todoapp.client.pem" --format Pem --no-password
dotnet dev-certs https --trust
```

3) Make the `prestart` helper robust (optional) — the `aspnetcore-https.js` script can be updated to create the folder automatically before exporting the cert. Replace the existing export check with this snippet or add it just before calling `dotnet`:

```javascript
fs.mkdirSync(baseFolder, { recursive: true });

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
	spawn('dotnet', [
		'dev-certs',
		'https',
		'--export-path',
		certFilePath,
		'--format',
		'Pem',
		'--no-password',
	], {stdio: 'inherit',})
		.on('exit', (code) => process.exit(code));
}
```

This prevents the export error when the target directory doesn't exist. The script is located at `todoapp.client/aspnetcore-https.js`.
