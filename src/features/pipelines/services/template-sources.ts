// Auto-generated template bundle for Cloudflare Workers (no fs access)
// DO NOT EDIT — regenerate by reading .hbs files from src/features/pipelines/templates/

export const TEMPLATE_SOURCES: Record<string, string> = {
  "build-pipeline.json.hbs": `{
  "id": -1,
  "name": "{{combination.pipelineName}}",
  "type": 2,
  "quality": 1,
  "path": "\\\\",
  "project": {
    "name": "{{config.adoProjectName}}"
  },
  "variables": {
    "buildScript": {
      "value": "{{combination.buildScript}}",
      "allowOverride": false,
      "isSecret": false
    },
    "nodeVersion": {
      "value": "{{config.nodeVersion}}",
      "allowOverride": false,
      "isSecret": false
    }{{#if config.tokenReplacement.enabled}},
    "environmentFilePath": {
      "value": "{{config.tokenReplacement.environmentFilePath}}",
      "allowOverride": false,
      "isSecret": false
    }{{/if}}
  },
  "variableGroups": [],
  "tags": [],
  "triggers": [
    {
      "branchFilters": [
        "+{{combination.branchName}}"
      ],
      "pathFilters": [],
      "batchChanges": false,
      "maxConcurrentBuildsPerBranch": 1,
      "pollingInterval": 0,
      "triggerType": 2
    }
  ],
  "process": {
    "phases": [
      {
        "steps": [

          {{! ── Step 1: NodeTool ── }}
          {
            "environment": {},
            "enabled": true,
            "continueOnError": false,
            "alwaysRun": false,
            "displayName": "Use Node.js $(nodeVersion)",
            "timeoutInMinutes": 0,
            "condition": "succeeded()",
            "task": {
              "id": "31c75bbb-bcdf-4706-8d7f-66a6b596f0b8",
              "versionSpec": "0.*",
              "definitionType": "task"
            },
            "inputs": {
              "versionSpec": "$(nodeVersion)",
              "checkLatest": "false"
            }
          },

          {{! ── Step 2: npm ci ── }}
          {
            "environment": {},
            "enabled": true,
            "continueOnError": false,
            "alwaysRun": false,
            "displayName": "npm ci",
            "timeoutInMinutes": 0,
            "condition": "succeeded()",
            "task": {
              "id": "46e4be58-730b-4389-8a2f-ea10b3e5e815",
              "versionSpec": "2.*",
              "definitionType": "task"
            },
            "inputs": {
              "connectedServiceNameARM": "",
              "scriptType": "bash",
              "scriptLocation": "inlineScript",
              "inlineScript": "npm ci",
              "workingDirectory": "",
              "failOnStandardError": "false"
            }
          }{{#if config.qualityGates.enabled}}{{#if config.qualityGates.typescript.enabled}},

          {{! ── Quality Gate: TypeScript ── }}
          {
            "environment": {},
            "enabled": true,
            "continueOnError": false,
            "alwaysRun": false,
            "displayName": "Quality Gate — TypeScript check",
            "timeoutInMinutes": 0,
            "condition": "succeeded()",
            "task": {
              "id": "46e4be58-730b-4389-8a2f-ea10b3e5e815",
              "versionSpec": "2.*",
              "definitionType": "task"
            },
            "inputs": {
              "connectedServiceNameARM": "",
              "scriptType": "bash",
              "scriptLocation": "inlineScript",
              "inlineScript": "{{config.qualityGates.typescript.command}}",
              "workingDirectory": "$(Build.SourcesDirectory)",
              "failOnStandardError": "false"
            }
          }{{/if}}{{#if config.qualityGates.lint.enabled}},

          {{! ── Quality Gate: ESLint ── }}
          {
            "environment": {},
            "enabled": true,
            "continueOnError": false,
            "alwaysRun": false,
            "displayName": "Quality Gate — ESLint",
            "timeoutInMinutes": 0,
            "condition": "succeeded()",
            "task": {
              "id": "46e4be58-730b-4389-8a2f-ea10b3e5e815",
              "versionSpec": "2.*",
              "definitionType": "task"
            },
            "inputs": {
              "connectedServiceNameARM": "",
              "scriptType": "bash",
              "scriptLocation": "inlineScript",
              "inlineScript": "{{config.qualityGates.lint.command}}",
              "workingDirectory": "$(Build.SourcesDirectory)",
              "failOnStandardError": "false"
            }
          }{{/if}}{{#if config.qualityGates.tests.enabled}},

          {{! ── Quality Gate: Unit Tests ── }}
          {
            "environment": {},
            "enabled": true,
            "continueOnError": false,
            "alwaysRun": false,
            "displayName": "Quality Gate — Unit tests",
            "timeoutInMinutes": 0,
            "condition": "succeeded()",
            "task": {
              "id": "46e4be58-730b-4389-8a2f-ea10b3e5e815",
              "versionSpec": "2.*",
              "definitionType": "task"
            },
            "inputs": {
              "connectedServiceNameARM": "",
              "scriptType": "bash",
              "scriptLocation": "inlineScript",
              "inlineScript": "{{config.qualityGates.tests.command}}",
              "workingDirectory": "$(Build.SourcesDirectory)",
              "failOnStandardError": "false"
            }
          }{{/if}}{{#if config.qualityGates.format.enabled}},

          {{! ── Quality Gate: Format Check ── }}
          {
            "environment": {},
            "enabled": true,
            "continueOnError": false,
            "alwaysRun": false,
            "displayName": "Quality Gate — Format check",
            "timeoutInMinutes": 0,
            "condition": "succeeded()",
            "task": {
              "id": "46e4be58-730b-4389-8a2f-ea10b3e5e815",
              "versionSpec": "2.*",
              "definitionType": "task"
            },
            "inputs": {
              "connectedServiceNameARM": "",
              "scriptType": "bash",
              "scriptLocation": "inlineScript",
              "inlineScript": "{{config.qualityGates.format.command}}",
              "workingDirectory": "$(Build.SourcesDirectory)",
              "failOnStandardError": "false"
            }
          }{{/if}}{{/if}}{{#if config.tokenReplacement.enabled}},

          {{! ── Step 3: FileTransform ── }}
          {
            "environment": {},
            "enabled": true,
            "continueOnError": false,
            "alwaysRun": false,
            "displayName": "Token replacement — {{config.tokenReplacement.environmentFilePath}}",
            "timeoutInMinutes": 0,
            "condition": "succeeded()",
            "task": {
              "id": "f81a0706-d56c-41be-b2c8-a41cc90e39e2",
              "versionSpec": "2.*",
              "definitionType": "task"
            },
            "inputs": {
              "folderPath": "$(System.DefaultWorkingDirectory)",
              "xmlTransformationRules": "",
              "jsonTargetFiles": "{{config.tokenReplacement.environmentFilePath}}"
            }
          }{{/if}},

          {{! ── Step 4: npm run build ── }}
          {
            "environment": {},
            "enabled": true,
            "continueOnError": false,
            "alwaysRun": false,
            "displayName": "npm run build ({{combination.buildScript}})",
            "timeoutInMinutes": 0,
            "condition": "succeeded()",
            "task": {
              "id": "46e4be58-730b-4389-8a2f-ea10b3e5e815",
              "versionSpec": "2.*",
              "definitionType": "task"
            },
            "inputs": {
              "connectedServiceNameARM": "",
              "scriptType": "bash",
              "scriptLocation": "inlineScript",
              "inlineScript": "npm run build -- --configuration=$(buildScript)",
              "workingDirectory": "",
              "failOnStandardError": "false"
            }
          },

          {{! ── Step 5: Publish build artifact ── }}
          {
            "environment": {},
            "enabled": true,
            "continueOnError": false,
            "alwaysRun": false,
            "displayName": "Publish artifact — {{combination.pipelineName}}",
            "timeoutInMinutes": 0,
            "condition": "succeeded()",
            "task": {
              "id": "2ff763a7-ce83-4e1f-bc89-0ae63477cebe",
              "versionSpec": "1.*",
              "definitionType": "task"
            },
            "inputs": {
              "PathtoPublish": "$(System.DefaultWorkingDirectory)/{{#if config.hasBrowserSubfolder}}{{config.distFolder}}/browser{{else}}{{config.distFolder}}{{/if}}",
              "ArtifactName": "{{combination.pipelineName}}",
              "publishLocation": "Container",
              "TargetPath": "",
              "appendCommitMessageToRunName": "true"
            }
          }

        ],
        "name": "Agent job 1",
        "refName": "Job_1",
        "condition": "succeeded()",
        "target": {
          "executionOptions": {
            "type": 0
          },
          "allowScriptsAuthAccessOption": false,
          "type": 1,
          "demands": [],
          "agentSpecification": {
            "identifier": "windows-latest"
          }
        },
        "jobAuthorizationScope": 1,
        "jobTimeoutInMinutes": 60,
        "jobCancelTimeoutInMinutes": 5
      }
    ],
    "type": 1
  },
  "repository": {
    "properties": {
      "labelSources": "0",
      "labelSourcesFormat": "$(Build.BuildNumber)",
      "reportBuildStatus": "true",
      "gitLfsSupport": "false",
      "skipSyncSource": "false",
      "cleanOptions": "0",
      "fetchDepth": "0",
      "checkoutNestedSubmodules": "false"
    },
    "id": "{{config.repositoryName}}",
    "type": "TfsGit",
    "name": "{{config.repositoryName}}",
    "defaultBranch": "refs/heads/{{combination.branchName}}",
    "clean": "false",
    "checkoutSubmodules": false
  },
  "options": [],
  "jobAuthorizationScope": 1,
  "jobTimeoutInMinutes": 60,
  "jobCancelTimeoutInMinutes": 5,
  "badgeEnabled": true,
  "buildNumberFormat": "$(date:yyyyMMdd)$(rev:.r)"
}
`,
  "build-pipeline.yaml.hbs": `# ============================================================
# PipeForge — Generated YAML CI Build Pipeline
# Pipeline : {{combination.pipelineName}}
# Project  : {{config.projectName}}
# Market   : {{combination.market.name}} ({{combination.market.code}})
# Env      : {{combination.environment}}
# {{#if combination.language}}Language : {{combination.language.name}} ({{combination.language.code}}){{/if}}
# ============================================================

trigger:
  branches:
    include:
      - {{combination.branchName}}

pr: none

pool:
  vmImage: 'ubuntu-latest'

variables:
  - name: buildScript
    value: '{{combination.buildScript}}'
  - name: pipelineName
    value: '{{combination.pipelineName}}'
  - name: nodeVersion
    value: '{{config.nodeVersion}}'
{{#if config.tokenReplacement.enabled}}
  - name: environmentFilePath
    value: '{{config.tokenReplacement.environmentFilePath}}'
{{#each (splitCsv config.tokenReplacement.secretVariableNames)}}
  - name: {{this}}
    value: ''
{{/each}}
{{/if}}

steps:

  # ── 1. Install Node.js ───────────────────────────────────
  - task: NodeTool@0
    displayName: 'Use Node.js $(nodeVersion)'
    inputs:
      versionSpec: '$(nodeVersion)'

  # ── 2. Install dependencies ──────────────────────────────
  - script: npm ci
    displayName: 'npm ci'
    workingDirectory: '$(Build.SourcesDirectory)'

{{#if config.qualityGates.enabled}}
{{#if config.qualityGates.typescript.enabled}}
  # ── Quality Gate: TypeScript ───────────────────────────────
  - script: {{config.qualityGates.typescript.command}}
    displayName: 'Quality Gate — TypeScript check'
    workingDirectory: '$(Build.SourcesDirectory)'

{{/if}}
{{#if config.qualityGates.lint.enabled}}
  # ── Quality Gate: ESLint ───────────────────────────────────
  - script: {{config.qualityGates.lint.command}}
    displayName: 'Quality Gate — ESLint'
    workingDirectory: '$(Build.SourcesDirectory)'

{{/if}}
{{#if config.qualityGates.tests.enabled}}
  # ── Quality Gate: Unit Tests ───────────────────────────────
  - script: {{config.qualityGates.tests.command}}
    displayName: 'Quality Gate — Unit tests'
    workingDirectory: '$(Build.SourcesDirectory)'

{{/if}}
{{#if config.qualityGates.format.enabled}}
  # ── Quality Gate: Format Check ─────────────────────────────
  - script: {{config.qualityGates.format.command}}
    displayName: 'Quality Gate — Format check'
    workingDirectory: '$(Build.SourcesDirectory)'

{{/if}}
{{/if}}
{{#if config.tokenReplacement.enabled}}
  # ── 3. Token replacement (environment file transform) ────
  - task: FileTransform@2
    displayName: 'Token replacement — {{config.tokenReplacement.environmentFilePath}}'
    inputs:
      folderPath: '$(Build.SourcesDirectory)'
      xmlTransformationRules: ''
      jsonTargetFiles: '{{config.tokenReplacement.environmentFilePath}}'
{{/if}}

  # ── {{#if config.tokenReplacement.enabled}}4{{else}}3{{/if}}. Build ──────────────────────────────────────────────
  - script: npm run build -- --configuration=$(buildScript)
    displayName: 'npm run build ({{combination.buildScript}})'
    workingDirectory: '$(Build.SourcesDirectory)'

  # ── {{#if config.tokenReplacement.enabled}}5{{else}}4{{/if}}. Publish build artifact ──────────────────────────────
  - task: PublishBuildArtifacts@1
    displayName: 'Publish artifact — $(pipelineName)'
    inputs:
      pathToPublish: '$(Build.SourcesDirectory)/{{#if config.hasBrowserSubfolder}}{{config.distFolder}}/browser{{else}}{{config.distFolder}}{{/if}}'
      artifactName: '$(pipelineName)'
      publishLocation: 'Container'
`,
  "readme.md.hbs": `# {{config.projectName}} — Azure DevOps Pipelines

> Generated by **PipeForge** on {{generatedAt}}

---

## Project Overview

| Field | Value |
|-------|-------|
| **Project Name** | \`{{config.projectName}}\` |
| **Repository** | \`{{config.repositoryName}}\` |
| **ADO Organization** | \`{{config.adoOrganization}}\` |
| **ADO Project** | \`{{config.adoProjectName}}\` |
| **Node Version** | \`{{config.nodeVersion}}\` |
| **Dist Folder** | \`{{config.distFolder}}{{#if config.hasBrowserSubfolder}}/browser{{/if}}\` |
| **Deploy Target** | \`{{config.deployTarget}}\` |
| **Multi-Language** | \`{{#if config.isMultiLanguage}}Yes{{else}}No{{/if}}\` |

---

## Scope

### Environments

{{#each config.environments}}
- \`{{this}}\`
{{/each}}

### Markets

| Name | Code | Status |
|------|------|--------|
{{#each config.markets}}
| {{name}} | \`{{code}}\` | {{#if enabled}}Enabled{{else}}Disabled{{/if}} |
{{/each}}

{{#if config.isMultiLanguage}}
### Languages

{{#each config.languages}}
- **{{name}}** (\`{{code}}\`)
{{/each}}
{{/if}}

---

## Pipeline Naming Convention

All pipelines follow the pattern:

\`\`\`
{ENV}-{MARKET}-{MFE}-{LANG}
\`\`\`

{{#if config.isMultiLanguage}}
Example: \`QA-SAUDI-{{config.projectName}}-EN\`
{{else}}
Example: \`QA-SAUDI-{{config.projectName}}\`
{{/if}}

---

## Generated Files

The following {{generatedFiles.length}} files were generated:

| # | File Name | Type | Path |
|---|-----------|------|------|
{{#each generatedFiles}}
| {{addOne @index}} | \`{{name}}\` | {{type}} | \`{{path}}\` |
{{/each}}

---

## Pipeline Combinations

Each combination maps to one build pipeline and one release pipeline:

| Pipeline Name | Environment | Market | {{#if config.isMultiLanguage}}Language | {{/if}}Branch | Build Script |
|---------------|-------------|--------|{{#if config.isMultiLanguage}}---------|{{/if}}--------|--------------|
{{#each combinations}}
| \`{{pipelineName}}\` | {{environment}} | {{market.name}} | {{#if ../config.isMultiLanguage}}{{language.name}} | {{/if}}\`{{branchName}}\` | \`{{buildScript}}\` |
{{/each}}

---

## How to Import into Azure DevOps

### YAML Pipelines (build-pipeline.yaml)

1. In Azure DevOps, navigate to **Pipelines > Pipelines**.
2. Click **New pipeline**.
3. Select **Azure Repos Git** (or your repository source).
4. Choose **Existing Azure Pipelines YAML file**.
5. Select the branch and point to the generated \`.yaml\` file.
6. Click **Continue**, then **Save and run**.

### Classic JSON Pipelines (build-pipeline.json / release-*.json)

#### Build (Classic JSON)

1. Navigate to **Pipelines > Pipelines**.
2. Click **New pipeline** and switch to the Classic Editor.
3. Use the **Import** option (three-dot menu) to upload the \`build-pipeline.json\` file.
4. Review the imported pipeline, fix any pending service connection references, and save.

#### Release (Classic JSON)

1. Navigate to **Pipelines > Releases**.
2. Click **New** > **Import release pipeline**.
3. Upload the \`release-*.json\` file for the corresponding combination.
4. After importing:
   - Re-link the artifact source to the correct build pipeline.
   - Verify service connection \`{{config.serviceConnectionId}}\` is accessible.
   - Set any secret variable values (they are not exported in the JSON).
5. Save and create a release to validate the configuration.

---

## Configuration Notes

{{#if config.tokenReplacement.enabled}}
### Token Replacement

Token replacement is **enabled** for this project.

- **Environment file**: \`{{config.tokenReplacement.environmentFilePath}}\`
- **Secret variable names**: \`{{config.tokenReplacement.secretVariableNames}}\`

The \`FileTransform@2\` task is included in build pipelines. Ensure all secret variables listed above are defined as secret pipeline variables before running a build.
{{else}}
### Token Replacement

Token replacement is **disabled** for this project. No \`FileTransform\` task is included in the build pipelines.
{{/if}}

{{#if config.triggerPipelineAfterDeploy}}
### Downstream Pipeline Trigger

After each successful deployment, a downstream pipeline trigger is configured.

- **Trigger Pipeline ID**: \`{{config.triggerPipelineId}}\`

Ensure the \`System.AccessToken\` has permission to queue builds in the target pipeline.
{{/if}}

{{#if config.protectedPaths.length}}
### Protected Files Setup

Certain files are preserved across deployments by backing them up to a separate container and restoring after each deploy.

**Backup container:** \`{{config.protectedPathsContainer}}\`

**Protected paths:**
{{#each config.protectedPaths}}
- \`{{this}}\`
{{/each}}

**One-time setup** — create the backup container and upload your protected files:

\`\`\`bash
# Create the backup container
az storage container create \\
  --name '{{config.protectedPathsContainer}}' \\
  --account-name <YOUR_STORAGE_ACCOUNT>

# Upload each protected file (repeat for each path)
az storage blob upload \\
  --container-name '{{config.protectedPathsContainer}}' \\
  --name '<PATH>' \\
  --file '<LOCAL_FILE>' \\
  --account-name <YOUR_STORAGE_ACCOUNT>
\`\`\`

After setup, every deployment will automatically restore these files from the backup container to \`$web\`.
{{/if}}

### Service Connection

All Azure tasks reference service connection: **\`{{config.serviceConnectionId}}\`**

Verify this service connection exists in your ADO project under **Project Settings > Service connections** before importing any pipeline.

---

## QA vs Production Branches

| Environment | Branch |
|-------------|--------|
| QA | \`{{config.qaBranch}}\` |
| PROD | \`{{config.productionBranch}}\` |

---

## Troubleshooting

### Pipeline fails on npm ci

This usually means your package-lock.json is out of sync with package.json.

Resolution:
  1. Delete package-lock.json from your project root
  2. Delete the node_modules folder
  3. Run: npm install
  4. Commit the newly generated package-lock.json
  5. Push and re-run the pipeline

Why npm ci instead of npm install?
npm ci is faster and stricter in CI environments. It fails immediately
if package-lock.json is missing or out of sync, providing a clear signal.
Always commit your package-lock.json to the repository.

---

*This README was auto-generated by PipeForge. Do not edit manually — regenerate from the PipeForge wizard if changes are needed.*
`,
  "release-appservice.json.hbs": `{
  "source": 2,
  "id": -1,
  "name": "RELEASE-{{combination.pipelineName}}",
  "type": 1,
  "quality": 1,
  "path": "\\\\",
  "createdOn": "{{generatedAt}}",
  "project": {
    "name": "{{config.adoProjectName}}"
  },
  "variables": {
    "appServiceName": {
      "value": "{{appServiceName}}",
      "allowOverride": false,
      "isSecret": false
    },
    "deploymentPath": {
      "value": "{{combination.deploymentPath}}",
      "allowOverride": false,
      "isSecret": false
    },
    "projectName": {
      "value": "{{config.projectName}}",
      "allowOverride": false,
      "isSecret": false
    },
    "serviceConnectionId": {
      "value": "{{config.serviceConnectionId}}",
      "allowOverride": false,
      "isSecret": false
    }
  },
  "variableGroups": [],
  "environments": [
    {
      "id": 1,
      "name": "{{combination.environment}}",
      "rank": 1,
      "owner": {
        "displayName": "PipeForge"
      },
      "variables": {},
      "variableGroups": [],
      "preDeployApprovals": {
        "approvals": [
          {
            "rank": 1,
            "isAutomated": true,
            "isNotificationOn": false
          }
        ],
        "approvalOptions": {
          "requiredApproverCount": null,
          "releaseCreatorCanBeApprover": false,
          "autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped": false,
          "enforceIdentityRevalidation": false,
          "timeoutInMinutes": 0,
          "executionOrder": 1
        }
      },
      "postDeployApprovals": {
        "approvals": [
          {
            "rank": 1,
            "isAutomated": true,
            "isNotificationOn": false
          }
        ],
        "approvalOptions": {
          "requiredApproverCount": null,
          "releaseCreatorCanBeApprover": false,
          "autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped": false,
          "enforceIdentityRevalidation": false,
          "timeoutInMinutes": 0,
          "executionOrder": 2
        }
      },
      "deployPhases": [
        {
          "deploymentInput": {
            "parallelExecution": {
              "parallelExecutionType": 0
            },
            "agentSpecification": {
              "identifier": "windows-latest"
            },
            "skipArtifactsDownload": false,
            "artifactsDownloadInput": {
              "downloadInputs": [
                {
                  "artifactItems": [],
                  "alias": "{{combination.artifactAlias}}",
                  "artifactType": "Build",
                  "artifactDownloadMode": "All"
                }
              ]
            },
            "queueId": 0,
            "demands": [],
            "enableAccessToken": false,
            "timeoutInMinutes": 0,
            "jobCancelTimeoutInMinutes": 1,
            "condition": "succeeded()",
            "overrideInputs": {}
          },
          "rank": 1,
          "phaseType": 1,
          "name": "Agent job",
          "refName": "Job_1",
          "workflowTasks": [

            {{! ── Task 1: AzureRmWebAppDeployment@4 ── }}
            {
              "taskId": "497d490f-eea7-4f2b-ab94-48d9c1acdcb1",
              "version": "4.*",
              "name": "Azure App Service Deploy — {{combination.pipelineName}}",
              "refName": "AzureRmWebAppDeployment",
              "enabled": true,
              "alwaysRun": false,
              "continueOnError": false,
              "timeoutInMinutes": 0,
              "retryCountOnTaskFailure": 0,
              "definitionType": "task",
              "overrideInputs": {},
              "condition": "succeeded()",
              "inputs": {
                "ConnectionType": "AzureRM",
                "ConnectedServiceName": "{{config.serviceConnectionId}}",
                "PublishProfilePath": "$(System.DefaultWorkingDirectory)/**/*.pubxml",
                "PublishProfilePassword": "",
                "WebAppKind": "webApp",
                "WebAppName": "$(appServiceName)",
                "DeployToSlotOrASEFlag": "false",
                "ResourceGroupName": "",
                "SlotName": "production",
                "VirtualApplication": "",
                "Package": "$(System.DefaultWorkingDirectory)/{{combination.artifactAlias}}/**/*.zip",
                "packageForLinux": "$(System.DefaultWorkingDirectory)/{{combination.artifactAlias}}/**/*.zip",
                "RuntimeStack": "",
                "StartupCommand": "",
                "ScriptType": "",
                "InlineScript": ":: You can provide your deployment commands here. One command per line.",
                "WebConfigParameters": "",
                "AppSettings": "",
                "ConfigurationSettings": "",
                "enableCustomDeployment": "false",
                "DeploymentType": "webDeploy",
                "TakeAppOfflineFlag": "true",
                "UseWebDeploy": "false",
                "ExcludeFilesFromAppDataFlag": "true",
                "AdditionalArguments": "-retryAttempts:6 -retryInterval:10000",
                "RenameFilesFlag": "true",
                "RemoveAdditionalFilesFlag": "false",
                "enableXmlTransform": "false",
                "enableXmlVariableSubstitution": "false",
                "JSONFiles": ""
              }
            }{{#if config.triggerPipelineAfterDeploy}},

            {{! ── Task 2 (conditional): Trigger downstream pipeline ── }}
            {
              "taskId": "9c3e8943-130d-4c78-ac63-8af81df62dfb",
              "version": "0.*",
              "name": "Trigger downstream pipeline",
              "refName": "TriggerDownstreamPipeline",
              "enabled": true,
              "alwaysRun": false,
              "continueOnError": false,
              "timeoutInMinutes": 0,
              "retryCountOnTaskFailure": 0,
              "definitionType": "task",
              "overrideInputs": {},
              "condition": "succeeded()",
              "inputs": {
                "waitForCompletion": "false",
                "buildDefinition": "{{config.triggerPipelineId}}",
                "queueBuildForUserThatTriggeredBuild": "true",
                "ignoreSslCertificateErrors": "false",
                "useSameSourceVersion": "false",
                "useCustomSourceVersion": "false",
                "buildParameters": "",
                "storeInEnvironment": "false",
                "authenticationMethod": "OAuth Token",
                "password": "$(System.AccessToken)",
                "enableSecureParameters": "false"
              }
            }{{/if}}

          ]
        }
      ],
      "environmentOptions": {
        "emailNotificationType": "OnlyOnFailure",
        "emailRecipients": "release.environment.owner;release.creator",
        "skipArtifactsDownload": false,
        "timeoutInMinutes": 0,
        "enableAccessToken": false,
        "publishDeploymentStatus": true,
        "badgeEnabled": false,
        "autoLinkWorkItems": false,
        "pullRequestDeploymentEnabled": false
      },
      "demands": [],
      "conditions": [
        {
          "name": "{{combination.artifactAlias}}",
          "conditionType": 8,
          "value": ""
        }
      ],
      "executionPolicy": {
        "concurrencyCount": 1,
        "queueDepthCount": 0
      },
      "schedules": [],
      "retentionPolicy": {
        "daysToKeep": 30,
        "releasesToKeep": 3,
        "retainBuild": true
      },
      "processParameters": {},
      "properties": {}
    }
  ],
  "artifacts": [
    {
      "sourceId": "",
      "type": "Build",
      "alias": "{{combination.artifactAlias}}",
      "definitionReference": {
        "artifactSourceDefinitionUrl": {
          "id": "",
          "name": ""
        },
        "defaultVersionType": {
          "id": "latestType",
          "name": "Latest"
        },
        "definition": {
          "id": "",
          "name": "{{combination.pipelineName}}"
        },
        "project": {
          "id": "",
          "name": "{{config.adoProjectName}}"
        }
      },
      "isPrimary": true,
      "isRetained": false
    }
  ],
  "triggers": [
    {
      "artifactAlias": "{{combination.artifactAlias}}",
      "triggerConditions": [],
      "triggerType": 1
    }
  ],
  "releaseNameFormat": "Release-$(rev:r)",
  "tags": [],
  "properties": {}
}
`,
  "release-storage.json.hbs": `{
  "source": 2,
  "id": -1,
  "name": "RELEASE-{{combination.pipelineName}}",
  "type": 1,
  "quality": 1,
  "path": "\\\\",
  "createdOn": "{{generatedAt}}",
  "project": {
    "name": "{{config.adoProjectName}}"
  },
  "variables": {
    "storageAccountName": {
      "value": "{{storageAccountName}}",
      "allowOverride": false,
      "isSecret": false
    },
    "deploymentPath": {
      "value": "{{combination.deploymentPath}}",
      "allowOverride": false,
      "isSecret": false
    },
    "projectName": {
      "value": "{{config.projectName}}",
      "allowOverride": false,
      "isSecret": false
    },
    "serviceConnectionId": {
      "value": "{{config.serviceConnectionId}}",
      "allowOverride": false,
      "isSecret": false
    }
  },
  "variableGroups": [],
  "environments": [
    {
      "id": 1,
      "name": "{{combination.environment}}",
      "rank": 1,
      "owner": {
        "displayName": "PipeForge"
      },
      "variables": {},
      "variableGroups": [],
      "preDeployApprovals": {
        "approvals": [
          {
            "rank": 1,
            "isAutomated": true,
            "isNotificationOn": false
          }
        ],
        "approvalOptions": {
          "requiredApproverCount": null,
          "releaseCreatorCanBeApprover": false,
          "autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped": false,
          "enforceIdentityRevalidation": false,
          "timeoutInMinutes": 0,
          "executionOrder": 1
        }
      },
      "postDeployApprovals": {
        "approvals": [
          {
            "rank": 1,
            "isAutomated": true,
            "isNotificationOn": false
          }
        ],
        "approvalOptions": {
          "requiredApproverCount": null,
          "releaseCreatorCanBeApprover": false,
          "autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped": false,
          "enforceIdentityRevalidation": false,
          "timeoutInMinutes": 0,
          "executionOrder": 2
        }
      },
      "deployPhases": [
        {
          "deploymentInput": {
            "parallelExecution": {
              "parallelExecutionType": 0
            },
            "agentSpecification": {
              "identifier": "windows-latest"
            },
            "skipArtifactsDownload": false,
            "artifactsDownloadInput": {
              "downloadInputs": [
                {
                  "artifactItems": [],
                  "alias": "{{combination.artifactAlias}}",
                  "artifactType": "Build",
                  "artifactDownloadMode": "All"
                }
              ]
            },
            "queueId": 0,
            "demands": [],
            "enableAccessToken": false,
            "timeoutInMinutes": 0,
            "jobCancelTimeoutInMinutes": 1,
            "condition": "succeeded()",
            "overrideInputs": {}
          },
          "rank": 1,
          "phaseType": 1,
          "name": "Agent job",
          "refName": "Job_1",
          "workflowTasks": [

            {{! ── Task 1: Delete existing blobs (primary path) ── }}
            {
              "taskId": "46e4be58-730b-88da-2d50-57f4867f51b1",
              "version": "0.*",
              "name": "Azure CLI — delete blobs at primary path",
              "refName": "AzureCLI_Delete_Primary",
              "enabled": true,
              "alwaysRun": false,
              "continueOnError": false,
              "timeoutInMinutes": 0,
              "retryCountOnTaskFailure": 0,
              "definitionType": "task",
              "overrideInputs": {},
              "condition": "succeeded()",
              "inputs": {
                "connectedServiceNameARM": "{{config.serviceConnectionId}}",
                "scriptType": "bash",
                "scriptLocation": "inlineScript",
                "inlineScript": "az storage blob delete-batch --source '$web' --account-name $(storageAccountName) --pattern '$(deploymentPath)/*'",
                "addSpnToEnvironment": "false",
                "useGlobalConfig": "false",
                "cwd": "$(System.DefaultWorkingDirectory)/{{combination.artifactAlias}}",
                "failOnStandardError": "false",
                "visibleAzLogin": "true"
              }
            },

            {{! ── Task 2: Upload blobs to primary deployment path ── }}
            {
              "taskId": "46e4be58-730b-88da-2d50-57f4867f51b1",
              "version": "0.*",
              "name": "Azure CLI — upload blobs to primary path",
              "refName": "AzureCLI_Upload_Primary",
              "enabled": true,
              "alwaysRun": false,
              "continueOnError": false,
              "timeoutInMinutes": 0,
              "retryCountOnTaskFailure": 0,
              "definitionType": "task",
              "overrideInputs": {},
              "condition": "succeeded()",
              "inputs": {
                "connectedServiceNameARM": "{{config.serviceConnectionId}}",
                "scriptType": "bash",
                "scriptLocation": "inlineScript",
                "inlineScript": "az storage blob upload-batch --destination '$web/$(deploymentPath)' --source . --account-name $(storageAccountName) --overwrite true",
                "addSpnToEnvironment": "false",
                "useGlobalConfig": "false",
                "cwd": "$(System.DefaultWorkingDirectory)/{{combination.artifactAlias}}",
                "failOnStandardError": "false",
                "visibleAzLogin": "true"
              }
            },

            {{! ── Task 3: Delete existing blobs (versioned path) ── }}
            {
              "taskId": "46e4be58-730b-88da-2d50-57f4867f51b1",
              "version": "0.*",
              "name": "Azure CLI — delete blobs at versioned path",
              "refName": "AzureCLI_Delete_Versioned",
              "enabled": true,
              "alwaysRun": false,
              "continueOnError": false,
              "timeoutInMinutes": 0,
              "retryCountOnTaskFailure": 0,
              "definitionType": "task",
              "overrideInputs": {},
              "condition": "succeeded()",
              "inputs": {
                "connectedServiceNameARM": "{{config.serviceConnectionId}}",
                "scriptType": "bash",
                "scriptLocation": "inlineScript",
                "inlineScript": "az storage blob delete-batch --source '$web' --account-name $(storageAccountName) --pattern 'v/$(deploymentPath)/*'",
                "addSpnToEnvironment": "false",
                "useGlobalConfig": "false",
                "cwd": "$(System.DefaultWorkingDirectory)/{{combination.artifactAlias}}",
                "failOnStandardError": "false",
                "visibleAzLogin": "true"
              }
            },

            {{! ── Task 4: Upload blobs to versioned path ── }}
            {
              "taskId": "46e4be58-730b-88da-2d50-57f4867f51b1",
              "version": "0.*",
              "name": "Azure CLI — upload blobs to versioned path",
              "refName": "AzureCLI_Upload_Versioned",
              "enabled": true,
              "alwaysRun": false,
              "continueOnError": false,
              "timeoutInMinutes": 0,
              "retryCountOnTaskFailure": 0,
              "definitionType": "task",
              "overrideInputs": {},
              "condition": "succeeded()",
              "inputs": {
                "connectedServiceNameARM": "{{config.serviceConnectionId}}",
                "scriptType": "bash",
                "scriptLocation": "inlineScript",
                "inlineScript": "az storage blob upload-batch --destination '$web/v/$(deploymentPath)' --source . --account-name $(storageAccountName) --overwrite true",
                "addSpnToEnvironment": "false",
                "useGlobalConfig": "false",
                "cwd": "$(System.DefaultWorkingDirectory)/{{combination.artifactAlias}}",
                "failOnStandardError": "false",
                "visibleAzLogin": "true"
              }
            }{{#if hasProtectedPaths}},

            {{! ── Task 5: Restore protected files from backup container ── }}
            {
              "taskId": "46e4be58-730b-88da-2d50-57f4867f51b1",
              "version": "0.*",
              "name": "Azure CLI — restore protected files",
              "refName": "AzureCLI_Restore_Protected",
              "enabled": true,
              "alwaysRun": false,
              "continueOnError": false,
              "timeoutInMinutes": 0,
              "retryCountOnTaskFailure": 0,
              "definitionType": "task",
              "overrideInputs": {},
              "condition": "succeeded()",
              "inputs": {
                "connectedServiceNameARM": "{{config.serviceConnectionId}}",
                "scriptType": "bash",
                "scriptLocation": "inlineScript",
                "inlineScript": "az storage blob copy start-batch --source-container '{{protectedPathsContainer}}' --destination-container '$web' --account-name $(storageAccountName)",
                "addSpnToEnvironment": "false",
                "useGlobalConfig": "false",
                "cwd": "$(System.DefaultWorkingDirectory)",
                "failOnStandardError": "false",
                "visibleAzLogin": "true"
              }
            }{{/if}}

          ]
        }
      ],
      "environmentOptions": {
        "emailNotificationType": "OnlyOnFailure",
        "emailRecipients": "release.environment.owner;release.creator",
        "skipArtifactsDownload": false,
        "timeoutInMinutes": 0,
        "enableAccessToken": false,
        "publishDeploymentStatus": true,
        "badgeEnabled": false,
        "autoLinkWorkItems": false,
        "pullRequestDeploymentEnabled": false
      },
      "demands": [],
      "conditions": [
        {
          "name": "{{combination.artifactAlias}}",
          "conditionType": 8,
          "value": ""
        }
      ],
      "executionPolicy": {
        "concurrencyCount": 1,
        "queueDepthCount": 0
      },
      "schedules": [],
      "retentionPolicy": {
        "daysToKeep": 30,
        "releasesToKeep": 3,
        "retainBuild": true
      },
      "processParameters": {},
      "properties": {}
    }
  ],
  "artifacts": [
    {
      "sourceId": "",
      "type": "Build",
      "alias": "{{combination.artifactAlias}}",
      "definitionReference": {
        "artifactSourceDefinitionUrl": {
          "id": "",
          "name": ""
        },
        "defaultVersionType": {
          "id": "latestType",
          "name": "Latest"
        },
        "definition": {
          "id": "",
          "name": "{{combination.pipelineName}}"
        },
        "project": {
          "id": "",
          "name": "{{config.adoProjectName}}"
        }
      },
      "isPrimary": true,
      "isRetained": false
    }
  ],
  "triggers": [
    {
      "artifactAlias": "{{combination.artifactAlias}}",
      "triggerConditions": [],
      "triggerType": 1
    }
  ],
  "releaseNameFormat": "Release-$(rev:r)",
  "tags": [],
  "properties": {}
}
`,
  "release-swa.json.hbs": `{
  "source": 2,
  "id": -1,
  "name": "RELEASE-{{combination.pipelineName}}",
  "type": 1,
  "quality": 1,
  "path": "\\\\",
  "createdOn": "{{generatedAt}}",
  "project": {
    "name": "{{config.adoProjectName}}"
  },
  "variables": {
    "swaDeploymentToken": {
      "value": "{{swaDeploymentToken}}",
      "allowOverride": false,
      "isSecret": true
    },
    "deploymentPath": {
      "value": "{{combination.deploymentPath}}",
      "allowOverride": false,
      "isSecret": false
    },
    "projectName": {
      "value": "{{config.projectName}}",
      "allowOverride": false,
      "isSecret": false
    },
    "serviceConnectionId": {
      "value": "{{config.serviceConnectionId}}",
      "allowOverride": false,
      "isSecret": false
    }
  },
  "variableGroups": [],
  "environments": [
    {
      "id": 1,
      "name": "{{combination.environment}}",
      "rank": 1,
      "owner": {
        "displayName": "PipeForge"
      },
      "variables": {},
      "variableGroups": [],
      "preDeployApprovals": {
        "approvals": [
          {
            "rank": 1,
            "isAutomated": true,
            "isNotificationOn": false
          }
        ],
        "approvalOptions": {
          "requiredApproverCount": null,
          "releaseCreatorCanBeApprover": false,
          "autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped": false,
          "enforceIdentityRevalidation": false,
          "timeoutInMinutes": 0,
          "executionOrder": 1
        }
      },
      "postDeployApprovals": {
        "approvals": [
          {
            "rank": 1,
            "isAutomated": true,
            "isNotificationOn": false
          }
        ],
        "approvalOptions": {
          "requiredApproverCount": null,
          "releaseCreatorCanBeApprover": false,
          "autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped": false,
          "enforceIdentityRevalidation": false,
          "timeoutInMinutes": 0,
          "executionOrder": 2
        }
      },
      "deployPhases": [
        {
          "deploymentInput": {
            "parallelExecution": {
              "parallelExecutionType": 0
            },
            "agentSpecification": {
              "identifier": "windows-latest"
            },
            "skipArtifactsDownload": false,
            "artifactsDownloadInput": {
              "downloadInputs": [
                {
                  "artifactItems": [],
                  "alias": "{{combination.artifactAlias}}",
                  "artifactType": "Build",
                  "artifactDownloadMode": "All"
                }
              ]
            },
            "queueId": 0,
            "demands": [],
            "enableAccessToken": false,
            "timeoutInMinutes": 0,
            "jobCancelTimeoutInMinutes": 1,
            "condition": "succeeded()",
            "overrideInputs": {}
          },
          "rank": 1,
          "phaseType": 1,
          "name": "Agent job",
          "refName": "Job_1",
          "workflowTasks": [

            {{! ── Task 1: Install SWA CLI + deploy — ONE AzureCLI@2 task (verified GUID: 46e4be58-730b-4389-8a2f-ea10b3e5e815) ── }}
            {
              "taskId": "46e4be58-730b-4389-8a2f-ea10b3e5e815",
              "version": "2.*",
              "name": "Deploy to SWA",
              "refName": "SWA_Deploy",
              "enabled": true,
              "alwaysRun": false,
              "continueOnError": false,
              "timeoutInMinutes": 0,
              "retryCountOnTaskFailure": 0,
              "definitionType": "task",
              "overrideInputs": {},
              "condition": "succeeded()",
              "inputs": {
                "connectedServiceNameARM": "{{config.serviceConnectionId}}",
                "scriptType": "bash",
                "scriptLocation": "inlineScript",
                "inlineScript": "npm list -g @azure/static-web-apps-cli 2>/dev/null || npm install -g @azure/static-web-apps-cli\\n\\nswa deploy \\"$(System.DefaultWorkingDirectory)/{{combination.artifactAlias}}\\" \\\\\\n  --deployment-token $(SWA_TOKEN) \\\\\\n  --env production",
                "addSpnToEnvironment": "false",
                "useGlobalConfig": "false",
                "failOnStandardError": "false",
                "visibleAzLogin": "true",
                "keepAzSessionActive": "false"
              }
            }{{#if config.triggerPipelineAfterDeploy}},

            {{! ── Task 2 (conditional): Trigger downstream pipeline — TriggerBuild@2 (verified GUID: 05485ce0-4948-481c-a89f-f21fa2fe9a74) ── }}
            {
              "taskId": "05485ce0-4948-481c-a89f-f21fa2fe9a74",
              "version": "2.*",
              "name": "Trigger Azure DevOps Pipeline: Build",
              "refName": "TriggerDownstreamPipeline",
              "enabled": true,
              "alwaysRun": false,
              "continueOnError": false,
              "timeoutInMinutes": 0,
              "retryCountOnTaskFailure": 0,
              "definitionType": "task",
              "overrideInputs": {},
              "condition": "succeeded()",
              "inputs": {
                "connectedServiceName": "{{config.serviceConnectionId}}",
                "project": "{{config.adoProjectName}}",
                "Pipeline": "Build",
                "buildDefinition": "{{config.triggerPipelineId}}",
                "buildapiversion": "6.0",
                "releaseapiversion": "6.0"
              }
            }{{/if}}

          ]
        }
      ],
      "environmentOptions": {
        "emailNotificationType": "OnlyOnFailure",
        "emailRecipients": "release.environment.owner;release.creator",
        "skipArtifactsDownload": false,
        "timeoutInMinutes": 0,
        "enableAccessToken": false,
        "publishDeploymentStatus": true,
        "badgeEnabled": false,
        "autoLinkWorkItems": false,
        "pullRequestDeploymentEnabled": false
      },
      "demands": [],
      "conditions": [
        {
          "name": "{{combination.artifactAlias}}",
          "conditionType": 8,
          "value": ""
        }
      ],
      "executionPolicy": {
        "concurrencyCount": 1,
        "queueDepthCount": 0
      },
      "schedules": [],
      "retentionPolicy": {
        "daysToKeep": 30,
        "releasesToKeep": 3,
        "retainBuild": true
      },
      "processParameters": {},
      "properties": {}
    }
  ],
  "artifacts": [
    {
      "sourceId": "",
      "type": "Build",
      "alias": "{{combination.artifactAlias}}",
      "definitionReference": {
        "artifactSourceDefinitionUrl": {
          "id": "",
          "name": ""
        },
        "defaultVersionType": {
          "id": "latestType",
          "name": "Latest"
        },
        "definition": {
          "id": "",
          "name": "{{combination.pipelineName}}"
        },
        "project": {
          "id": "",
          "name": "{{config.adoProjectName}}"
        }
      },
      "isPrimary": true,
      "isRetained": false
    }
  ],
  "triggers": [
    {
      "artifactAlias": "{{combination.artifactAlias}}",
      "triggerConditions": [],
      "triggerType": 1
    }
  ],
  "releaseNameFormat": "Release-$(rev:r)",
  "tags": [],
  "properties": {}
}
`,
  "github-actions/gha-appservice.yml.hbs": `name: {{pipelineName}}

on:
{{#if triggers.push}}
  push:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.pr}}
  pull_request:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.manual}}
  workflow_dispatch:
{{/if}}
{{#if triggers.schedule}}
  schedule:
    - cron: '{{cronExpression}}'
{{/if}}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '{{nodeVersion}}'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

{{#if qualityGates.enabled}}
{{#if qualityGates.typescript.enabled}}
      - name: Quality Gate — TypeScript check
        run: {{qualityGates.typescript.command}}
{{/if}}
{{#if qualityGates.lint.enabled}}
      - name: Quality Gate — ESLint
        run: {{qualityGates.lint.command}}
{{/if}}
{{#if qualityGates.tests.enabled}}
      - name: Quality Gate — Unit tests
        run: {{qualityGates.tests.command}}
{{/if}}
{{#if qualityGates.format.enabled}}
      - name: Quality Gate — Format check
        run: {{qualityGates.format.command}}
{{/if}}
{{/if}}
{{#if useTokenReplacement}}
      - name: Replace tokens
        uses: cschleiden/replace-tokens@v1
        with:
          files: '["{{envFilePath}}"]'
        env:
          ENCRYPTION_IV: $\\{{ secrets.ENCRYPTION_IV }}
          ENCRYPTION_KEY: $\\{{ secrets.ENCRYPTION_KEY }}
{{/if}}

      - name: Build
        run: npm run {{buildScript}}

      - name: Deploy to App Service
        uses: azure/webapps-deploy@v2
        with:
          app-name: {{appServiceName}}
          publish-profile: $\\{{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ./{{distFolder}}{{#if hasBrowserSubfolder}}/browser{{/if}}
`,
  "github-actions/gha-ftp-cpanel.yml.hbs": `name: {{pipelineName}}

on:
{{#if triggers.push}}
  push:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.pr}}
  pull_request:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.manual}}
  workflow_dispatch:
{{/if}}
{{#if triggers.schedule}}
  schedule:
    - cron: '{{cronExpression}}'
{{/if}}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '{{nodeVersion}}'
          cache: 'npm'

      - run: npm ci

{{#if qualityGates.enabled}}
{{#if qualityGates.typescript.enabled}}
      - name: Quality Gate — TypeScript check
        run: {{qualityGates.typescript.command}}
{{/if}}
{{#if qualityGates.lint.enabled}}
      - name: Quality Gate — ESLint
        run: {{qualityGates.lint.command}}
{{/if}}
{{#if qualityGates.tests.enabled}}
      - name: Quality Gate — Unit tests
        run: {{qualityGates.tests.command}}
{{/if}}
{{#if qualityGates.format.enabled}}
      - name: Quality Gate — Format check
        run: {{qualityGates.format.command}}
{{/if}}
{{/if}}
{{#if useTokenReplacement}}
      - name: Replace tokens
        uses: cschleiden/replace-tokens@v1
        with:
          tokenPrefix: '#{'
          tokenSuffix: '}#'
          files: '["{{envFilePath}}"]'
        env:
          ENCRYPTION_IV: \${{"{{"}} secrets.ENCRYPTION_IV {{"}}"}}
          ENCRYPTION_KEY: \${{"{{"}} secrets.ENCRYPTION_KEY {{"}}"}}

{{/if}}
      - run: npm run {{buildScript}}

      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: \${{"{{"}} secrets.FTP_SERVER {{"}}"}}
          username: \${{"{{"}} secrets.FTP_USERNAME {{"}}"}}
          password: \${{"{{"}} secrets.FTP_PASSWORD {{"}}"}}
          local-dir: ./{{distFolder}}{{#if hasBrowserSubfolder}}/browser{{/if}}/
          server-dir: {{remotePath}}/
`,
  "github-actions/gha-storage.yml.hbs": `name: {{pipelineName}}

on:
{{#if triggers.push}}
  push:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.pr}}
  pull_request:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.manual}}
  workflow_dispatch:
{{/if}}
{{#if triggers.schedule}}
  schedule:
    - cron: '{{cronExpression}}'
{{/if}}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '{{nodeVersion}}'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

{{#if qualityGates.enabled}}
{{#if qualityGates.typescript.enabled}}
      - name: Quality Gate — TypeScript check
        run: {{qualityGates.typescript.command}}
{{/if}}
{{#if qualityGates.lint.enabled}}
      - name: Quality Gate — ESLint
        run: {{qualityGates.lint.command}}
{{/if}}
{{#if qualityGates.tests.enabled}}
      - name: Quality Gate — Unit tests
        run: {{qualityGates.tests.command}}
{{/if}}
{{#if qualityGates.format.enabled}}
      - name: Quality Gate — Format check
        run: {{qualityGates.format.command}}
{{/if}}
{{/if}}
{{#if useTokenReplacement}}
      - name: Replace tokens
        uses: cschleiden/replace-tokens@v1
        with:
          files: '["{{envFilePath}}"]'
        env:
          ENCRYPTION_IV: $\\{{ secrets.ENCRYPTION_IV }}
          ENCRYPTION_KEY: $\\{{ secrets.ENCRYPTION_KEY }}
{{/if}}

      - name: Build
        run: npm run {{buildScript}}

      - name: Azure Login
        uses: azure/login@v2
        with:
          creds: $\\{{ secrets.AZURE_CREDENTIALS }}

      - name: Clear storage
        run: |
          az storage blob delete-batch \\
            --account-name {{storageAccountName}} \\
            --source '$web'

      - name: Deploy to storage
        run: |
          az storage blob upload-batch \\
            --account-name {{storageAccountName}} \\
            --destination '$web' \\
            --source './{{distFolder}}{{#if hasBrowserSubfolder}}/browser{{/if}}' \\
            --destination-path '{{deploymentPath}}' \\
            --pattern '*.*'

          az storage blob upload-batch \\
            --account-name {{storageAccountName}} \\
            --destination '$web' \\
            --source './{{distFolder}}{{#if hasBrowserSubfolder}}/browser{{/if}}' \\
            --pattern '*.*'
{{#if hasProtectedPaths}}

      - name: Restore protected files
        run: |
          az storage blob copy start-batch \\
            --source-container '{{protectedPathsContainer}}' \\
            --destination-container '$web' \\
            --account-name {{storageAccountName}}
{{/if}}
`,
  "github-actions/gha-swa.yml.hbs": `name: {{pipelineName}}

on:
{{#if triggers.push}}
  push:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.pr}}
  pull_request:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.manual}}
  workflow_dispatch:
{{/if}}
{{#if triggers.schedule}}
  schedule:
    - cron: '{{cronExpression}}'
{{/if}}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '{{nodeVersion}}'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

{{#if qualityGates.enabled}}
{{#if qualityGates.typescript.enabled}}
      - name: Quality Gate — TypeScript check
        run: {{qualityGates.typescript.command}}
{{/if}}
{{#if qualityGates.lint.enabled}}
      - name: Quality Gate — ESLint
        run: {{qualityGates.lint.command}}
{{/if}}
{{#if qualityGates.tests.enabled}}
      - name: Quality Gate — Unit tests
        run: {{qualityGates.tests.command}}
{{/if}}
{{#if qualityGates.format.enabled}}
      - name: Quality Gate — Format check
        run: {{qualityGates.format.command}}
{{/if}}
{{/if}}
{{#if useTokenReplacement}}
      - name: Replace tokens
        uses: cschleiden/replace-tokens@v1
        with:
          files: '["{{envFilePath}}"]'
        env:
          ENCRYPTION_IV: $\\{{ secrets.ENCRYPTION_IV }}
          ENCRYPTION_KEY: $\\{{ secrets.ENCRYPTION_KEY }}
{{/if}}

      - name: Build
        run: npm run {{buildScript}}

      - name: Deploy to Static Web App
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: $\\{{ secrets.{{swaSecretName}} }}
          repo_token: $\\{{ secrets.GITHUB_TOKEN }}
          action: upload
          app_location: {{distFolder}}{{#if hasBrowserSubfolder}}/browser{{/if}}
          skip_app_build: true
`,
  "github-actions/secrets-guide.md.hbs": `# GitHub Secrets Required for {{projectName}}

Add these secrets to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

{{#if (eq deployTarget "storage-account")}}
## Azure Credentials

| Secret Name | Value |
|---|---|
| \`AZURE_CREDENTIALS\` | JSON output of: \`az ad sp create-for-rbac --sdk-auth\` |
{{/if}}
{{#if (eq deployTarget "static-web-app")}}
## Azure Credentials

| Secret Name | Value |
|---|---|
| \`AZURE_CREDENTIALS\` | JSON output of: \`az ad sp create-for-rbac --sdk-auth\` |
{{/if}}
{{#if (eq deployTarget "app-service")}}
## Azure Credentials

| Secret Name | Value |
|---|---|
| \`AZURE_CREDENTIALS\` | JSON output of: \`az ad sp create-for-rbac --sdk-auth\` |
{{/if}}

{{#if useTokenReplacement}}
## Token Replacement Secrets

{{#if tokenMappings.length}}
| Secret Name | Description |
|---|---|
{{#each tokenMappings}}
| \`{{this.variableName}}\` | Value to replace \`{{this.tokenName}}\` in environment files |
{{/each}}
{{else}}
Add your environment token values as repository secrets.
{{/if}}
{{/if}}

{{#if (eq deployTarget "storage-account")}}
## Storage Account

No additional secrets needed — deployment uses \`AZURE_CREDENTIALS\`.
{{/if}}

{{#if (eq deployTarget "static-web-app")}}
## Static Web App Tokens

| Secret Name | Value |
|---|---|
{{#each swaSecrets}}
| \`{{this.secretName}}\` | SWA deployment token from Azure Portal → Static Web Apps → {{this.label}} → Manage deployment token |
{{/each}}
{{/if}}

{{#if (eq deployTarget "app-service")}}
## App Service

| Secret Name | Value |
|---|---|
| \`AZURE_WEBAPP_PUBLISH_PROFILE\` | Publish profile XML from Azure Portal → App Service → Download publish profile |
{{/if}}

{{#if (eq deployTarget "ftp-cpanel")}}
## FTP / cPanel Credentials

| Secret Name | Value |
|---|---|
| \`FTP_SERVER\` | Your FTP hostname (e.g. \`ftp.yourdomain.com\`) — found in cPanel → FTP Accounts |
| \`FTP_USERNAME\` | Your FTP username (e.g. \`deploy@yourdomain.com\`) |
| \`FTP_PASSWORD\` | Your FTP password |

> **Security note:** Never store FTP credentials in your code or PipeForge.
> Add them directly to GitHub: **Settings → Secrets and variables → Actions → New repository secret**

### Where to find FTP credentials

| Hosting Provider | Location |
|---|---|
| **SiteGround** | Site Tools → FTP Accounts |
| **Hostinger** | hPanel → Files → FTP Accounts |
| **GoDaddy** | cPanel → FTP Accounts |
| **Bluehost** | cPanel → FTP Accounts |
| **Namecheap** | cPanel → FTP Accounts |

We recommend creating a dedicated FTP account for deployments with access limited to your site directory.
{{/if}}

{{#if (eq deployTarget "vercel")}}
## Vercel Secrets

| Secret Name | Value |
|---|---|
| \`VERCEL_TOKEN\` | Vercel account token from vercel.com → Settings → Tokens |
| \`VERCEL_ORG_ID\` | Found in vercel.com → Settings → General |
| \`VERCEL_PROJECT_ID\` | Found in your Vercel project settings |
{{/if}}

{{#if (eq deployTarget "netlify")}}
## Netlify Secrets

| Secret Name | Value |
|---|---|
| \`NETLIFY_AUTH_TOKEN\` | Netlify personal access token from app.netlify.com → User settings → Applications |
| \`NETLIFY_SITE_ID\` | Your Netlify site ID (found in Site settings → General → Site ID) |
{{/if}}

{{#if (eq deployTarget "firebase")}}
## Firebase Secrets

| Secret Name | Value |
|---|---|
| \`FIREBASE_SERVICE_ACCOUNT\` | Firebase service account JSON — Firebase Console → Project Settings → Service accounts → Generate new private key |

**Project ID configured:** \`{{firebaseProjectId}}\`
{{/if}}

{{#if (eq deployTarget "github-pages")}}
## GitHub Pages

No additional secrets required. GitHub Pages uses \`GITHUB_TOKEN\` which is automatically provided by GitHub Actions.

**Publish branch configured:** \`{{ghPagesBranch}}\`
{{/if}}

{{#if (eq deployTarget "cloudflare-pages")}}
## Cloudflare Pages Secrets

| Secret Name | Value |
|---|---|
| \`CLOUDFLARE_API_TOKEN\` | Cloudflare API token with Cloudflare Pages edit permissions |
| \`CLOUDFLARE_ACCOUNT_ID\` | Your Cloudflare account ID (found in the Cloudflare dashboard sidebar) |

**Pages project configured:** \`{{cloudflarePagesProject}}\`
{{/if}}

---
*Generated by PipeForge on {{generatedAt}}*
`,

  "github-actions/gha-vercel.yml.hbs": `name: {{pipelineName}}

on:
{{#if triggers.push}}
  push:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.pr}}
  pull_request:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.manual}}
  workflow_dispatch:
{{/if}}
{{#if triggers.schedule}}
  schedule:
    - cron: '{{cronExpression}}'
{{/if}}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '{{nodeVersion}}'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

{{#if qualityGates.enabled}}
{{#if qualityGates.typescript.enabled}}
      - name: Quality Gate — Type check
        run: {{qualityGates.typescript.command}}
{{/if}}
{{#if qualityGates.lint.enabled}}
      - name: Quality Gate — Lint
        run: {{qualityGates.lint.command}}
{{/if}}
{{#if qualityGates.tests.enabled}}
      - name: Quality Gate — Unit tests
        run: {{qualityGates.tests.command}}
{{/if}}
{{#if qualityGates.format.enabled}}
      - name: Quality Gate — Format check
        run: {{qualityGates.format.command}}
{{/if}}
{{/if}}

      - name: Build
        run: npm run {{buildScript}}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./{{distFolder}}{{#if hasBrowserSubfolder}}/browser{{/if}}
`,

  "github-actions/gha-netlify.yml.hbs": `name: {{pipelineName}}

on:
{{#if triggers.push}}
  push:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.pr}}
  pull_request:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.manual}}
  workflow_dispatch:
{{/if}}
{{#if triggers.schedule}}
  schedule:
    - cron: '{{cronExpression}}'
{{/if}}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '{{nodeVersion}}'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

{{#if qualityGates.enabled}}
{{#if qualityGates.typescript.enabled}}
      - name: Quality Gate — Type check
        run: {{qualityGates.typescript.command}}
{{/if}}
{{#if qualityGates.lint.enabled}}
      - name: Quality Gate — Lint
        run: {{qualityGates.lint.command}}
{{/if}}
{{#if qualityGates.tests.enabled}}
      - name: Quality Gate — Unit tests
        run: {{qualityGates.tests.command}}
{{/if}}
{{#if qualityGates.format.enabled}}
      - name: Quality Gate — Format check
        run: {{qualityGates.format.command}}
{{/if}}
{{/if}}

      - name: Build
        run: npm run {{buildScript}}

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: ./{{distFolder}}{{#if hasBrowserSubfolder}}/browser{{/if}}
          production-branch: {{branch}}
          github-token: \${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
          enable-pull-request-comment: true
          enable-commit-comment: true
        env:
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
`,

  "github-actions/gha-firebase.yml.hbs": `name: {{pipelineName}}

on:
{{#if triggers.push}}
  push:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.pr}}
  pull_request:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.manual}}
  workflow_dispatch:
{{/if}}
{{#if triggers.schedule}}
  schedule:
    - cron: '{{cronExpression}}'
{{/if}}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '{{nodeVersion}}'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

{{#if qualityGates.enabled}}
{{#if qualityGates.typescript.enabled}}
      - name: Quality Gate — Type check
        run: {{qualityGates.typescript.command}}
{{/if}}
{{#if qualityGates.lint.enabled}}
      - name: Quality Gate — Lint
        run: {{qualityGates.lint.command}}
{{/if}}
{{#if qualityGates.tests.enabled}}
      - name: Quality Gate — Unit tests
        run: {{qualityGates.tests.command}}
{{/if}}
{{#if qualityGates.format.enabled}}
      - name: Quality Gate — Format check
        run: {{qualityGates.format.command}}
{{/if}}
{{/if}}

      - name: Build
        run: npm run {{buildScript}}

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: \${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: \${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: {{firebaseProjectId}}
`,

  "github-actions/gha-github-pages.yml.hbs": `name: {{pipelineName}}

on:
{{#if triggers.push}}
  push:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.pr}}
  pull_request:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.manual}}
  workflow_dispatch:
{{/if}}
{{#if triggers.schedule}}
  schedule:
    - cron: '{{cronExpression}}'
{{/if}}

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '{{nodeVersion}}'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

{{#if qualityGates.enabled}}
{{#if qualityGates.typescript.enabled}}
      - name: Quality Gate — Type check
        run: {{qualityGates.typescript.command}}
{{/if}}
{{#if qualityGates.lint.enabled}}
      - name: Quality Gate — Lint
        run: {{qualityGates.lint.command}}
{{/if}}
{{#if qualityGates.tests.enabled}}
      - name: Quality Gate — Unit tests
        run: {{qualityGates.tests.command}}
{{/if}}
{{#if qualityGates.format.enabled}}
      - name: Quality Gate — Format check
        run: {{qualityGates.format.command}}
{{/if}}
{{/if}}

      - name: Build
        run: npm run {{buildScript}}

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./{{distFolder}}{{#if hasBrowserSubfolder}}/browser{{/if}}
          publish_branch: {{ghPagesBranch}}
          force_orphan: true
`,

  "github-actions/gha-cloudflare-pages.yml.hbs": `name: {{pipelineName}}

on:
{{#if triggers.push}}
  push:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.pr}}
  pull_request:
    branches: [ {{branch}} ]
{{/if}}
{{#if triggers.manual}}
  workflow_dispatch:
{{/if}}
{{#if triggers.schedule}}
  schedule:
    - cron: '{{cronExpression}}'
{{/if}}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '{{nodeVersion}}'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

{{#if qualityGates.enabled}}
{{#if qualityGates.typescript.enabled}}
      - name: Quality Gate — Type check
        run: {{qualityGates.typescript.command}}
{{/if}}
{{#if qualityGates.lint.enabled}}
      - name: Quality Gate — Lint
        run: {{qualityGates.lint.command}}
{{/if}}
{{#if qualityGates.tests.enabled}}
      - name: Quality Gate — Unit tests
        run: {{qualityGates.tests.command}}
{{/if}}
{{#if qualityGates.format.enabled}}
      - name: Quality Gate — Format check
        run: {{qualityGates.format.command}}
{{/if}}
{{/if}}

      - name: Build
        run: npm run {{buildScript}}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: {{cloudflarePagesProject}}
          directory: ./{{distFolder}}{{#if hasBrowserSubfolder}}/browser{{/if}}
          gitHubToken: \${{ secrets.GITHUB_TOKEN }}
`,
};
