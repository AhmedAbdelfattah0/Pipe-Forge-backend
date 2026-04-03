# ADO Task GUIDs — Verified Source of Truth

Every GUID extracted from real working IKEA production pipelines.
Read this file before modifying ANY pipeline template.
NEVER use a GUID not listed here without explicit confirmation.

## Build Pipeline Tasks — 100% verified

| GUID | Version | ADO Task | Used For |
|------|---------|----------|----------|
| 31c75bbb-bcdf-4706-8d7c-4da6a1959bc2 | 0.* | NodeTool@0 | Set Node.js version |
| fe47e961-9fa8-4106-8639-368c022d43ad | 1.* | Npm@1 | npm install / npm run |
| 5bfb729a-a7c8-4a78-a7c3-8d717bb7c13c | 2.* | CopyFiles@2 | Copy dist to staging |
| 2ff763a7-ce83-4e1f-bc89-0ae63477cebe | 1.* | PublishBuildArtifacts@1 | Publish dist folder |
| a8515ec8-7254-4ffd-912c-86772e2b5962 | 6.* | replacetokens@6 | Token replacement |

## Release Pipeline Tasks — 100% verified

| GUID | Version | ADO Task | Used For |
|------|---------|----------|----------|
| 46e4be58-730b-4389-8a2f-ea10b3e5e815 | 2.* | AzureCLI@2 | ALL release tasks: Storage, SWA, preserve files |
| 05485ce0-4948-481c-a89f-f21fa2fe9a74 | 2.* | TriggerBuild@2 | Trigger another pipeline |

## WRONG GUIDs — NEVER use these

| GUID | Why wrong |
|------|-----------|
| d9bafed4-0b18-4f58-968d-86655b4d2ce9 | CmdLine@2 — shell scripts only, NOT for Azure CLI tasks |
| 9c3e8943-130d-4c78-ac63-8af81df62dfb | Does not exist in ADO — causes import failure |
| 46e4be58-730b-88da-2d50-57f4867f51b1 | Wrong AzureCLI GUID variant — causes import failure |

## SWA Deploy — AzureCLI@2 inline script (verified from real pipeline)

ONE task only — combines install + deploy:
taskId: 46e4be58-730b-4389-8a2f-ea10b3e5e815
version: 2.*
inputs.scriptType: bash
inputs.inlineScript:
  npm list -g @azure/static-web-apps-cli 2>/dev/null || npm install -g @azure/static-web-apps-cli

  swa deploy "$(System.DefaultWorkingDirectory)/_{{artifactAlias}}/Dist Folder" \
    --deployment-token $(SWA_TOKEN) \
    --env production

## Storage Deploy — AzureCLI@2 inline scripts

Step 1 (delete primary): az storage blob delete-batch --account-name {{storageAccount}} --source $web
Step 2 (upload primary): az storage blob upload-batch (to scoped path)
Step 3 (delete versioned): az storage blob delete-batch (versioned path)
Step 4 (upload versioned): az storage blob upload-batch (to root / versioned path)

## Rules

1. NEVER guess or invent a GUID
2. ALWAYS use GUIDs from this file only
3. SWA deploy = ONE AzureCLI@2 task with inline script (not 3 separate tasks)
4. Agent: windows-latest for ALL release pipelines
5. After template change: npm run build + npx wrangler deploy before reporting Done
