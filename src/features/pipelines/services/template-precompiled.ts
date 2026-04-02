// @ts-nocheck
/**
 * template-precompiled.ts
 *
 * AUTO-GENERATED — do not edit by hand.
 * Regenerate by running: node scripts/precompile-templates.mjs
 *
 * Contains Handlebars templates precompiled at build time.
 * Using Handlebars.template(precompiledSpec) instead of Handlebars.compile(source)
 * avoids eval() / new Function() — required for Cloudflare Workers compatibility.
 *
 * @ts-nocheck suppresses implicit-any errors on the Handlebars-generated function params.
 */

import Handlebars from 'handlebars';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PRECOMPILED_TEMPLATES: Record<string, Handlebars.TemplateDelegate<any>> = {
  "build-pipeline.json.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ",\n    \"environmentFilePath\": {\n      \"value\": \""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"environmentFilePath") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    }";
},"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":88,"column":46},"end":{"line":109,"column":18}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":109,"column":18},"end":{"line":130,"column":18}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":130,"column":18},"end":{"line":151,"column":18}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":151,"column":18},"end":{"line":172,"column":18}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ",\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Quality Gate — TypeScript check\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"d9bafed4-0b18-4f58-968d-86655b4d2ce9\",\n              \"versionSpec\": \"2.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"script\": \""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\",\n              \"workingDirectory\": \"$(Build.SourcesDirectory)\",\n              \"failOnStderr\": \"false\"\n            }\n          }";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ",\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Quality Gate — ESLint\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"d9bafed4-0b18-4f58-968d-86655b4d2ce9\",\n              \"versionSpec\": \"2.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"script\": \""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\",\n              \"workingDirectory\": \"$(Build.SourcesDirectory)\",\n              \"failOnStderr\": \"false\"\n            }\n          }";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ",\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Quality Gate — Unit tests\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"d9bafed4-0b18-4f58-968d-86655b4d2ce9\",\n              \"versionSpec\": \"2.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"script\": \""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\",\n              \"workingDirectory\": \"$(Build.SourcesDirectory)\",\n              \"failOnStderr\": \"false\"\n            }\n          }";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ",\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Quality Gate — Format check\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"d9bafed4-0b18-4f58-968d-86655b4d2ce9\",\n              \"versionSpec\": \"2.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"script\": \""
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\",\n              \"workingDirectory\": \"$(Build.SourcesDirectory)\",\n              \"failOnStderr\": \"false\"\n            }\n          }";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ",\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Token replacement — "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"environmentFilePath") : stack1), depth0))
    + "\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"f81a0706-d56c-41be-b2c8-a41cc90e39e2\",\n              \"versionSpec\": \"2.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"folderPath\": \"$(System.DefaultWorkingDirectory)\",\n              \"xmlTransformationRules\": \"\",\n              \"jsonTargetFiles\": \""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"environmentFilePath") : stack1), depth0))
    + "\"\n            }\n          }";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"distFolder") : stack1), depth0))
    + "/browser";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"distFolder") : stack1), depth0));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  \"id\": -1,\n  \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n  \"type\": 2,\n  \"quality\": 1,\n  \"path\": \"\\\\\",\n  \"project\": {\n    \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + "\"\n  },\n  \"variables\": {\n    \"buildScript\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"buildScript") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    },\n    \"nodeVersion\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"nodeVersion") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    }"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":5},"end":{"line":25,"column":12}}})) != null ? stack1 : "")
    + "\n  },\n  \"variableGroups\": [],\n  \"tags\": [],\n  \"triggers\": [\n    {\n      \"branchFilters\": [\n        \"+"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"branchName") : stack1), depth0))
    + "\"\n      ],\n      \"pathFilters\": [],\n      \"batchChanges\": false,\n      \"maxConcurrentBuildsPerBranch\": 1,\n      \"pollingInterval\": 0,\n      \"triggerType\": 2\n    }\n  ],\n  \"process\": {\n    \"phases\": [\n      {\n        \"steps\": [\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Use Node.js $(nodeVersion)\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"31c75bbb-bcdf-4706-8d7c-4da6a1959bc2\",\n              \"versionSpec\": \"0.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"versionSource\": \"spec\",\n              \"versionSpec\": \"$(nodeVersion)\",\n              \"checkLatest\": \"false\"\n            }\n          },\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Install Dependencies (npm install)\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"fe47e961-9fa8-4106-8639-368c022d43ad\",\n              \"versionSpec\": \"1.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"command\": \"install\",\n              \"workingDir\": \"\",\n              \"verbose\": \"false\",\n              \"customRegistry\": \"useNpmrc\",\n              \"publishRegistry\": \"useExternalRegistry\"\n            }\n          }"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":88,"column":11},"end":{"line":172,"column":25}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":172,"column":25},"end":{"line":193,"column":18}}})) != null ? stack1 : "")
    + ",\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Build (npm run $(buildScript))\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"fe47e961-9fa8-4106-8639-368c022d43ad\",\n              \"versionSpec\": \"1.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"command\": \"custom\",\n              \"workingDir\": \"\",\n              \"verbose\": \"false\",\n              \"customCommand\": \"run $(buildScript)\",\n              \"customRegistry\": \"useNpmrc\",\n              \"publishRegistry\": \"useExternalRegistry\"\n            }\n          },\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Copy Files to: $(Build.ArtifactStagingDirectory)\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"5bfb729a-a7c8-4a78-a7c3-8d717bb7c13c\",\n              \"versionSpec\": \"2.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"SourceFolder\": \""
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"hasBrowserSubfolder") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(8, data, 0),"data":data,"loc":{"start":{"line":234,"column":31},"end":{"line":234,"column":130}}})) != null ? stack1 : "")
    + "\",\n              \"Contents\": \"**\",\n              \"TargetFolder\": \"$(Build.ArtifactStagingDirectory)\",\n              \"CleanTargetFolder\": \"false\",\n              \"OverWrite\": \"false\",\n              \"flattenFolders\": \"false\"\n            }\n          },\n\n          {\n            \"environment\": {},\n            \"enabled\": true,\n            \"continueOnError\": false,\n            \"alwaysRun\": false,\n            \"displayName\": \"Publish artifact — "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n            \"timeoutInMinutes\": 0,\n            \"condition\": \"succeeded()\",\n            \"task\": {\n              \"id\": \"2ff763a7-ce83-4e1f-bc89-0ae63477cebe\",\n              \"versionSpec\": \"1.*\",\n              \"definitionType\": \"task\"\n            },\n            \"inputs\": {\n              \"PathtoPublish\": \"$(Build.ArtifactStagingDirectory)\",\n              \"ArtifactName\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n              \"ArtifactType\": \"Container\"\n            }\n          }\n\n        ],\n        \"name\": \"Agent job 1\",\n        \"refName\": \"Job_1\",\n        \"condition\": \"succeeded()\",\n        \"target\": {\n          \"executionOptions\": {\n            \"type\": 0\n          },\n          \"allowScriptsAuthAccessOption\": false,\n          \"type\": 1\n        },\n        \"jobAuthorizationScope\": 1,\n        \"jobTimeoutInMinutes\": 60,\n        \"jobCancelTimeoutInMinutes\": 5\n      }\n    ],\n    \"target\": {\n      \"agentSpecification\": {\n        \"identifier\": \"windows-latest\"\n      }\n    },\n    \"type\": 1\n  },\n  \"repository\": {\n    \"properties\": {\n      \"labelSources\": \"0\",\n      \"labelSourcesFormat\": \"$(Build.BuildNumber)\",\n      \"reportBuildStatus\": \"true\",\n      \"gitLfsSupport\": \"false\",\n      \"skipSyncSource\": \"false\",\n      \"cleanOptions\": \"0\",\n      \"fetchDepth\": \"0\",\n      \"checkoutNestedSubmodules\": \"false\"\n    },\n    \"id\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"repositoryName") : stack1), depth0))
    + "\",\n    \"type\": \"TfsGit\",\n    \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"repositoryName") : stack1), depth0))
    + "\",\n    \"defaultBranch\": \"refs/heads/"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"branchName") : stack1), depth0))
    + "\",\n    \"clean\": \"false\",\n    \"checkoutSubmodules\": false\n  },\n  \"options\": [],\n  \"jobAuthorizationScope\": 1,\n  \"jobTimeoutInMinutes\": 60,\n  \"jobCancelTimeoutInMinutes\": 5,\n  \"badgeEnabled\": true,\n  \"buildNumberFormat\": \"$(date:yyyyMMdd)$(rev:.r)\"\n}\n";
},"useData":true}),
  "build-pipeline.yaml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "Language : "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"language") : stack1)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + " ("
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"language") : stack1)) != null ? lookupProperty(stack1,"code") : stack1), depth0))
    + ")";
},"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  - name: environmentFilePath\n    value: '"
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"environmentFilePath") : stack1), depth0))
    + "'\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(lookupProperty(helpers,"splitCsv")||(depth0 && lookupProperty(depth0,"splitCsv"))||container.hooks.helperMissing).call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"secretVariableNames") : stack1),{"name":"splitCsv","hash":{},"data":data,"loc":{"start":{"line":30,"column":8},"end":{"line":30,"column":62}}}),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":30,"column":0},"end":{"line":33,"column":9}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    return "  - name: "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "\n    value: ''\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":50,"column":0},"end":{"line":56,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":0},"end":{"line":63,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":64,"column":0},"end":{"line":70,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":71,"column":0},"end":{"line":77,"column":7}}})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  # ── Quality Gate: TypeScript ───────────────────────────────\n  - script: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n    displayName: 'Quality Gate — TypeScript check'\n    workingDirectory: '$(Build.SourcesDirectory)'\n\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  # ── Quality Gate: ESLint ───────────────────────────────────\n  - script: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n    displayName: 'Quality Gate — ESLint'\n    workingDirectory: '$(Build.SourcesDirectory)'\n\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  # ── Quality Gate: Unit Tests ───────────────────────────────\n  - script: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n    displayName: 'Quality Gate — Unit tests'\n    workingDirectory: '$(Build.SourcesDirectory)'\n\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  # ── Quality Gate: Format Check ─────────────────────────────\n  - script: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n    displayName: 'Quality Gate — Format check'\n    workingDirectory: '$(Build.SourcesDirectory)'\n\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  # ── 3. Token replacement (environment file transform) ────\n  - task: FileTransform@2\n    displayName: 'Token replacement — "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"environmentFilePath") : stack1), depth0))
    + "'\n    inputs:\n      folderPath: '$(Build.SourcesDirectory)'\n      xmlTransformationRules: ''\n      jsonTargetFiles: '"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"environmentFilePath") : stack1), depth0))
    + "'\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "4";
},"10":function(container,depth0,helpers,partials,data) {
    return "3";
},"11":function(container,depth0,helpers,partials,data) {
    return "5";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"distFolder") : stack1), depth0))
    + "/browser";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"distFolder") : stack1), depth0));
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "# ============================================================\n# PipeForge — Generated YAML CI Build Pipeline\n# Pipeline : "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\n# Project  : "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"projectName") : stack1), depth0))
    + "\n# Market   : "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"market") : stack1)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + " ("
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"market") : stack1)) != null ? lookupProperty(stack1,"code") : stack1), depth0))
    + ")\n# Env      : "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"environment") : stack1), depth0))
    + "\n# "
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"language") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":2},"end":{"line":7,"column":109}}})) != null ? stack1 : "")
    + "\n# ============================================================\n\ntrigger:\n  branches:\n    include:\n      - "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"branchName") : stack1), depth0))
    + "\n\npr: none\n\npool:\n  vmImage: 'ubuntu-latest'\n\nvariables:\n  - name: buildScript\n    value: '"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"buildScript") : stack1), depth0))
    + "'\n  - name: pipelineName\n    value: '"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "'\n  - name: nodeVersion\n    value: '"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"nodeVersion") : stack1), depth0))
    + "'\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":27,"column":0},"end":{"line":34,"column":7}}})) != null ? stack1 : "")
    + "\nsteps:\n\n  # ── 1. Install Node.js ───────────────────────────────────\n  - task: NodeTool@0\n    displayName: 'Use Node.js $(nodeVersion)'\n    inputs:\n      versionSpec: '$(nodeVersion)'\n\n  # ── 2. Install dependencies ──────────────────────────────\n  - script: npm ci\n    displayName: 'npm ci'\n    workingDirectory: '$(Build.SourcesDirectory)'\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qualityGates") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":49,"column":0},"end":{"line":78,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":79,"column":0},"end":{"line":87,"column":7}}})) != null ? stack1 : "")
    + "\n  # ── "
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(10, data, 0),"data":data,"loc":{"start":{"line":89,"column":7},"end":{"line":89,"column":63}}})) != null ? stack1 : "")
    + ". Build ──────────────────────────────────────────────\n  - script: npm run build -- --configuration=$(buildScript)\n    displayName: 'npm run build ("
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"buildScript") : stack1), depth0))
    + ")'\n    workingDirectory: '$(Build.SourcesDirectory)'\n\n  # ── "
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(9, data, 0),"data":data,"loc":{"start":{"line":94,"column":7},"end":{"line":94,"column":63}}})) != null ? stack1 : "")
    + ". Publish build artifact ──────────────────────────────\n  - task: PublishBuildArtifacts@1\n    displayName: 'Publish artifact — $(pipelineName)'\n    inputs:\n      pathToPublish: '$(Build.SourcesDirectory)/"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"hasBrowserSubfolder") : stack1),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(13, data, 0),"data":data,"loc":{"start":{"line":98,"column":48},"end":{"line":98,"column":147}}})) != null ? stack1 : "")
    + "'\n      artifactName: '$(pipelineName)'\n      publishLocation: 'Container'\n";
},"useData":true}),
  "github-actions/gha-appservice.yml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  push:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":26}}}) : helper)))
    + " ]\n";
},"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  pull_request:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":10,"column":26}}}) : helper)))
    + " ]\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "  workflow_dispatch:\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  schedule:\n    - cron: '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cronExpression") || (depth0 != null ? lookupProperty(depth0,"cronExpression") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cronExpression","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":31}}}) : helper)))
    + "'\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":0},"end":{"line":39,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":0},"end":{"line":47,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":0},"end":{"line":51,"column":7}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — TypeScript check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — ESLint\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Unit tests\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Format check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Replace tokens\n        uses: cschleiden/replace-tokens@v1\n        with:\n          files: '[\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"envFilePath") || (depth0 != null ? lookupProperty(depth0,"envFilePath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"envFilePath","hash":{},"data":data,"loc":{"start":{"line":57,"column":20},"end":{"line":57,"column":35}}}) : helper)))
    + "\"]'\n        env:\n          ENCRYPTION_IV: ${{ secrets.ENCRYPTION_IV }}\n          ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "/browser";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":22}}}) : helper)))
    + "\n\non:\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"push") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"pr") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"manual") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"schedule") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '"
    + alias4(((helper = (helper = lookupProperty(helpers,"nodeVersion") || (depth0 != null ? lookupProperty(depth0,"nodeVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeVersion","hash":{},"data":data,"loc":{"start":{"line":29,"column":25},"end":{"line":29,"column":40}}}) : helper)))
    + "'\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":0},"end":{"line":52,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":0},"end":{"line":61,"column":7}}})) != null ? stack1 : "")
    + "\n      - name: Build\n        run: npm run "
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":64,"column":21},"end":{"line":64,"column":36}}}) : helper)))
    + "\n\n      - name: Deploy to App Service\n        uses: azure/webapps-deploy@v2\n        with:\n          app-name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"appServiceName") || (depth0 != null ? lookupProperty(depth0,"appServiceName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"appServiceName","hash":{},"data":data,"loc":{"start":{"line":69,"column":20},"end":{"line":69,"column":38}}}) : helper)))
    + "\n          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}\n          package: ./"
    + alias4(((helper = (helper = lookupProperty(helpers,"distFolder") || (depth0 != null ? lookupProperty(depth0,"distFolder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distFolder","hash":{},"data":data,"loc":{"start":{"line":71,"column":21},"end":{"line":71,"column":35}}}) : helper)))
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasBrowserSubfolder") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":71,"column":35},"end":{"line":71,"column":77}}})) != null ? stack1 : "")
    + "\n";
},"useData":true}),
  "github-actions/gha-cloudflare-pages.yml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  push:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":26}}}) : helper)))
    + " ]\n";
},"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  pull_request:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":10,"column":26}}}) : helper)))
    + " ]\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "  workflow_dispatch:\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  schedule:\n    - cron: '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cronExpression") || (depth0 != null ? lookupProperty(depth0,"cronExpression") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cronExpression","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":31}}}) : helper)))
    + "'\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":0},"end":{"line":39,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":0},"end":{"line":47,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":0},"end":{"line":51,"column":7}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Type check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Lint\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Unit tests\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Format check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"tokenMappings") : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":54,"column":0},"end":{"line":58,"column":9}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Replace token — "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0))
    + "\n        run: |\n          find . -path ./node_modules -prune -o -name \"*.ts\" -print | xargs sed -i 's/#"
    + ((stack1 = alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0)) != null ? stack1 : "")
    + "#/${{ secrets."
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"variableName") : depth0), depth0))
    + " }}/g' 2>/dev/null || true\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "/browser";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":22}}}) : helper)))
    + "\n\non:\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"push") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"pr") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"manual") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"schedule") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '"
    + alias4(((helper = (helper = lookupProperty(helpers,"nodeVersion") || (depth0 != null ? lookupProperty(depth0,"nodeVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeVersion","hash":{},"data":data,"loc":{"start":{"line":29,"column":25},"end":{"line":29,"column":40}}}) : helper)))
    + "'\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":0},"end":{"line":52,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":0},"end":{"line":59,"column":7}}})) != null ? stack1 : "")
    + "\n      - name: Build\n        run: npm run "
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":62,"column":21},"end":{"line":62,"column":36}}}) : helper)))
    + "\n\n      - name: Deploy to Cloudflare Pages\n        uses: cloudflare/pages-action@v1\n        with:\n          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}\n          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}\n          projectName: "
    + alias4(((helper = (helper = lookupProperty(helpers,"cloudflarePagesProject") || (depth0 != null ? lookupProperty(depth0,"cloudflarePagesProject") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cloudflarePagesProject","hash":{},"data":data,"loc":{"start":{"line":69,"column":23},"end":{"line":69,"column":49}}}) : helper)))
    + "\n          directory: ./"
    + alias4(((helper = (helper = lookupProperty(helpers,"distFolder") || (depth0 != null ? lookupProperty(depth0,"distFolder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distFolder","hash":{},"data":data,"loc":{"start":{"line":70,"column":23},"end":{"line":70,"column":37}}}) : helper)))
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasBrowserSubfolder") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":70,"column":37},"end":{"line":70,"column":79}}})) != null ? stack1 : "")
    + "\n          gitHubToken: ${{ secrets.GITHUB_TOKEN }}\n";
},"useData":true}),
  "github-actions/gha-firebase.yml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  push:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":26}}}) : helper)))
    + " ]\n";
},"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  pull_request:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":10,"column":26}}}) : helper)))
    + " ]\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "  workflow_dispatch:\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  schedule:\n    - cron: '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cronExpression") || (depth0 != null ? lookupProperty(depth0,"cronExpression") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cronExpression","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":31}}}) : helper)))
    + "'\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":0},"end":{"line":39,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":0},"end":{"line":47,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":0},"end":{"line":51,"column":7}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Type check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Lint\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Unit tests\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Format check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"tokenMappings") : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":54,"column":0},"end":{"line":58,"column":9}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Replace token — "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0))
    + "\n        run: |\n          find . -path ./node_modules -prune -o -name \"*.ts\" -print | xargs sed -i 's/#"
    + ((stack1 = alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0)) != null ? stack1 : "")
    + "#/${{ secrets."
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"variableName") : depth0), depth0))
    + " }}/g' 2>/dev/null || true\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":22}}}) : helper)))
    + "\n\non:\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"push") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"pr") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"manual") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"schedule") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '"
    + alias4(((helper = (helper = lookupProperty(helpers,"nodeVersion") || (depth0 != null ? lookupProperty(depth0,"nodeVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeVersion","hash":{},"data":data,"loc":{"start":{"line":29,"column":25},"end":{"line":29,"column":40}}}) : helper)))
    + "'\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":0},"end":{"line":52,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":0},"end":{"line":59,"column":7}}})) != null ? stack1 : "")
    + "\n      - name: Build\n        run: npm run "
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":62,"column":21},"end":{"line":62,"column":36}}}) : helper)))
    + "\n\n      - name: Deploy to Firebase Hosting\n        uses: FirebaseExtended/action-hosting-deploy@v0\n        with:\n          repoToken: ${{ secrets.GITHUB_TOKEN }}\n          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}\n          channelId: live\n          projectId: "
    + alias4(((helper = (helper = lookupProperty(helpers,"firebaseProjectId") || (depth0 != null ? lookupProperty(depth0,"firebaseProjectId") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"firebaseProjectId","hash":{},"data":data,"loc":{"start":{"line":70,"column":21},"end":{"line":70,"column":42}}}) : helper)))
    + "\n";
},"useData":true}),
  "github-actions/gha-ftp-cpanel.yml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  push:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":26}}}) : helper)))
    + " ]\n";
},"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  pull_request:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":10,"column":26}}}) : helper)))
    + " ]\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "  workflow_dispatch:\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  schedule:\n    - cron: '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cronExpression") || (depth0 != null ? lookupProperty(depth0,"cronExpression") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cronExpression","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":31}}}) : helper)))
    + "'\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":0},"end":{"line":38,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":39,"column":0},"end":{"line":42,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":43,"column":0},"end":{"line":46,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":47,"column":0},"end":{"line":50,"column":7}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — TypeScript check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — ESLint\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Unit tests\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Format check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Replace tokens\n        uses: cschleiden/replace-tokens@v1\n        with:\n          tokenPrefix: '#{'\n          tokenSuffix: '}#'\n          files: '[\""
    + alias4(((helper = (helper = lookupProperty(helpers,"envFilePath") || (depth0 != null ? lookupProperty(depth0,"envFilePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"envFilePath","hash":{},"data":data,"loc":{"start":{"line":58,"column":20},"end":{"line":58,"column":35}}}) : helper)))
    + "\"]'\n        env:\n          ENCRYPTION_IV: $"
    + alias4(((helper = (helper = lookupProperty(helpers,"{{") || (depth0 != null ? lookupProperty(depth0,"{{") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"{{","hash":{},"data":data,"loc":{"start":{"line":60,"column":26},"end":{"line":60,"column":34}}}) : helper)))
    + " secrets.ENCRYPTION_IV "
    + alias4(((helper = (helper = lookupProperty(helpers,"}}") || (depth0 != null ? lookupProperty(depth0,"}}") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"}}","hash":{},"data":data,"loc":{"start":{"line":60,"column":57},"end":{"line":60,"column":65}}}) : helper)))
    + "\n          ENCRYPTION_KEY: $"
    + alias4(((helper = (helper = lookupProperty(helpers,"{{") || (depth0 != null ? lookupProperty(depth0,"{{") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"{{","hash":{},"data":data,"loc":{"start":{"line":61,"column":27},"end":{"line":61,"column":35}}}) : helper)))
    + " secrets.ENCRYPTION_KEY "
    + alias4(((helper = (helper = lookupProperty(helpers,"}}") || (depth0 != null ? lookupProperty(depth0,"}}") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"}}","hash":{},"data":data,"loc":{"start":{"line":61,"column":59},"end":{"line":61,"column":67}}}) : helper)))
    + "\n\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "/browser";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":22}}}) : helper)))
    + "\n\non:\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"push") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"pr") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"manual") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"schedule") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '"
    + alias4(((helper = (helper = lookupProperty(helpers,"nodeVersion") || (depth0 != null ? lookupProperty(depth0,"nodeVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeVersion","hash":{},"data":data,"loc":{"start":{"line":29,"column":25},"end":{"line":29,"column":40}}}) : helper)))
    + "'\n          cache: 'npm'\n\n      - run: npm ci\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":0},"end":{"line":51,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":52,"column":0},"end":{"line":63,"column":7}}})) != null ? stack1 : "")
    + "      - run: npm run "
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":64,"column":21},"end":{"line":64,"column":36}}}) : helper)))
    + "\n\n      - name: Deploy via FTP\n        uses: SamKirkland/FTP-Deploy-Action@v4.3.4\n        with:\n          server: $"
    + alias4(((helper = (helper = lookupProperty(helpers,"{{") || (depth0 != null ? lookupProperty(depth0,"{{") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"{{","hash":{},"data":data,"loc":{"start":{"line":69,"column":19},"end":{"line":69,"column":27}}}) : helper)))
    + " secrets.FTP_SERVER "
    + alias4(((helper = (helper = lookupProperty(helpers,"}}") || (depth0 != null ? lookupProperty(depth0,"}}") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"}}","hash":{},"data":data,"loc":{"start":{"line":69,"column":47},"end":{"line":69,"column":55}}}) : helper)))
    + "\n          username: $"
    + alias4(((helper = (helper = lookupProperty(helpers,"{{") || (depth0 != null ? lookupProperty(depth0,"{{") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"{{","hash":{},"data":data,"loc":{"start":{"line":70,"column":21},"end":{"line":70,"column":29}}}) : helper)))
    + " secrets.FTP_USERNAME "
    + alias4(((helper = (helper = lookupProperty(helpers,"}}") || (depth0 != null ? lookupProperty(depth0,"}}") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"}}","hash":{},"data":data,"loc":{"start":{"line":70,"column":51},"end":{"line":70,"column":59}}}) : helper)))
    + "\n          password: $"
    + alias4(((helper = (helper = lookupProperty(helpers,"{{") || (depth0 != null ? lookupProperty(depth0,"{{") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"{{","hash":{},"data":data,"loc":{"start":{"line":71,"column":21},"end":{"line":71,"column":29}}}) : helper)))
    + " secrets.FTP_PASSWORD "
    + alias4(((helper = (helper = lookupProperty(helpers,"}}") || (depth0 != null ? lookupProperty(depth0,"}}") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"}}","hash":{},"data":data,"loc":{"start":{"line":71,"column":51},"end":{"line":71,"column":59}}}) : helper)))
    + "\n          local-dir: ./"
    + alias4(((helper = (helper = lookupProperty(helpers,"distFolder") || (depth0 != null ? lookupProperty(depth0,"distFolder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distFolder","hash":{},"data":data,"loc":{"start":{"line":72,"column":23},"end":{"line":72,"column":37}}}) : helper)))
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasBrowserSubfolder") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":72,"column":37},"end":{"line":72,"column":79}}})) != null ? stack1 : "")
    + "/\n          server-dir: "
    + alias4(((helper = (helper = lookupProperty(helpers,"remotePath") || (depth0 != null ? lookupProperty(depth0,"remotePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"remotePath","hash":{},"data":data,"loc":{"start":{"line":73,"column":22},"end":{"line":73,"column":36}}}) : helper)))
    + "/\n";
},"useData":true}),
  "github-actions/gha-github-pages.yml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  push:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":26}}}) : helper)))
    + " ]\n";
},"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  pull_request:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":10,"column":26}}}) : helper)))
    + " ]\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "  workflow_dispatch:\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  schedule:\n    - cron: '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cronExpression") || (depth0 != null ? lookupProperty(depth0,"cronExpression") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cronExpression","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":31}}}) : helper)))
    + "'\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":0},"end":{"line":47,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":0},"end":{"line":51,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":52,"column":0},"end":{"line":55,"column":7}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Type check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Lint\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Unit tests\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Format check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"tokenMappings") : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":58,"column":0},"end":{"line":62,"column":9}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Replace token — "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0))
    + "\n        run: |\n          find . -path ./node_modules -prune -o -name \"*.ts\" -print | xargs sed -i 's/#"
    + ((stack1 = alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0)) != null ? stack1 : "")
    + "#/${{ secrets."
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"variableName") : depth0), depth0))
    + " }}/g' 2>/dev/null || true\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "/browser";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":22}}}) : helper)))
    + "\n\non:\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"push") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"pr") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"manual") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"schedule") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "\n# Required for GitHub Pages deployment\npermissions:\n  contents: write\n\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '"
    + alias4(((helper = (helper = lookupProperty(helpers,"nodeVersion") || (depth0 != null ? lookupProperty(depth0,"nodeVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeVersion","hash":{},"data":data,"loc":{"start":{"line":33,"column":25},"end":{"line":33,"column":40}}}) : helper)))
    + "'\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":39,"column":0},"end":{"line":56,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":57,"column":0},"end":{"line":63,"column":7}}})) != null ? stack1 : "")
    + "\n      - name: Build\n        run: npm run "
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":66,"column":21},"end":{"line":66,"column":36}}}) : helper)))
    + "\n\n      - name: Deploy to GitHub Pages\n        uses: peaceiris/actions-gh-pages@v3\n        with:\n          github_token: ${{ secrets.GITHUB_TOKEN }}\n          publish_dir: ./"
    + alias4(((helper = (helper = lookupProperty(helpers,"distFolder") || (depth0 != null ? lookupProperty(depth0,"distFolder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distFolder","hash":{},"data":data,"loc":{"start":{"line":72,"column":25},"end":{"line":72,"column":39}}}) : helper)))
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasBrowserSubfolder") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":72,"column":39},"end":{"line":72,"column":81}}})) != null ? stack1 : "")
    + "\n          publish_branch: "
    + alias4(((helper = (helper = lookupProperty(helpers,"ghPagesBranch") || (depth0 != null ? lookupProperty(depth0,"ghPagesBranch") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ghPagesBranch","hash":{},"data":data,"loc":{"start":{"line":73,"column":26},"end":{"line":73,"column":43}}}) : helper)))
    + "\n          force_orphan: true\n";
},"useData":true}),
  "github-actions/gha-netlify.yml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  push:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":26}}}) : helper)))
    + " ]\n";
},"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  pull_request:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":10,"column":26}}}) : helper)))
    + " ]\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "  workflow_dispatch:\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  schedule:\n    - cron: '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cronExpression") || (depth0 != null ? lookupProperty(depth0,"cronExpression") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cronExpression","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":31}}}) : helper)))
    + "'\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":0},"end":{"line":39,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":0},"end":{"line":47,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":0},"end":{"line":51,"column":7}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Type check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Lint\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Unit tests\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Format check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"tokenMappings") : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":54,"column":0},"end":{"line":58,"column":9}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Replace token — "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0))
    + "\n        run: |\n          find . -path ./node_modules -prune -o -name \"*.ts\" -print | xargs sed -i 's/#"
    + ((stack1 = alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0)) != null ? stack1 : "")
    + "#/${{ secrets."
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"variableName") : depth0), depth0))
    + " }}/g' 2>/dev/null || true\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "/browser";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":22}}}) : helper)))
    + "\n\non:\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"push") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"pr") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"manual") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"schedule") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '"
    + alias4(((helper = (helper = lookupProperty(helpers,"nodeVersion") || (depth0 != null ? lookupProperty(depth0,"nodeVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeVersion","hash":{},"data":data,"loc":{"start":{"line":29,"column":25},"end":{"line":29,"column":40}}}) : helper)))
    + "'\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":0},"end":{"line":52,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":0},"end":{"line":59,"column":7}}})) != null ? stack1 : "")
    + "\n      - name: Build\n        run: npm run "
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":62,"column":21},"end":{"line":62,"column":36}}}) : helper)))
    + "\n\n      - name: Deploy to Netlify\n        uses: nwtgck/actions-netlify@v3\n        with:\n          publish-dir: ./"
    + alias4(((helper = (helper = lookupProperty(helpers,"distFolder") || (depth0 != null ? lookupProperty(depth0,"distFolder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distFolder","hash":{},"data":data,"loc":{"start":{"line":67,"column":25},"end":{"line":67,"column":39}}}) : helper)))
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasBrowserSubfolder") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":67,"column":39},"end":{"line":67,"column":81}}})) != null ? stack1 : "")
    + "\n          production-branch: "
    + alias4(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":68,"column":29},"end":{"line":68,"column":39}}}) : helper)))
    + "\n          github-token: ${{ secrets.GITHUB_TOKEN }}\n          deploy-message: \"Deploy from GitHub Actions\"\n          enable-pull-request-comment: true\n          enable-commit-comment: true\n        env:\n          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}\n          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}\n";
},"useData":true}),
  "github-actions/gha-storage.yml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  push:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":26}}}) : helper)))
    + " ]\n";
},"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  pull_request:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":10,"column":26}}}) : helper)))
    + " ]\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "  workflow_dispatch:\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  schedule:\n    - cron: '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cronExpression") || (depth0 != null ? lookupProperty(depth0,"cronExpression") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cronExpression","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":31}}}) : helper)))
    + "'\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":0},"end":{"line":39,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":0},"end":{"line":47,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":0},"end":{"line":51,"column":7}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — TypeScript check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — ESLint\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Unit tests\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Format check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Replace tokens\n        uses: cschleiden/replace-tokens@v1\n        with:\n          files: '[\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"envFilePath") || (depth0 != null ? lookupProperty(depth0,"envFilePath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"envFilePath","hash":{},"data":data,"loc":{"start":{"line":57,"column":20},"end":{"line":57,"column":35}}}) : helper)))
    + "\"]'\n        env:\n          ENCRYPTION_IV: ${{ secrets.ENCRYPTION_IV }}\n          ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "/browser";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n      - name: Restore protected files\n        run: |\n          az storage blob copy start-batch \\\n            --source-container '"
    + alias4(((helper = (helper = lookupProperty(helpers,"protectedPathsContainer") || (depth0 != null ? lookupProperty(depth0,"protectedPathsContainer") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"protectedPathsContainer","hash":{},"data":data,"loc":{"start":{"line":96,"column":32},"end":{"line":96,"column":59}}}) : helper)))
    + "' \\\n            --destination-container '$web' \\\n            --account-name "
    + alias4(((helper = (helper = lookupProperty(helpers,"storageAccountName") || (depth0 != null ? lookupProperty(depth0,"storageAccountName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storageAccountName","hash":{},"data":data,"loc":{"start":{"line":98,"column":27},"end":{"line":98,"column":49}}}) : helper)))
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":22}}}) : helper)))
    + "\n\non:\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"push") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"pr") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"manual") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"schedule") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '"
    + alias4(((helper = (helper = lookupProperty(helpers,"nodeVersion") || (depth0 != null ? lookupProperty(depth0,"nodeVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeVersion","hash":{},"data":data,"loc":{"start":{"line":29,"column":25},"end":{"line":29,"column":40}}}) : helper)))
    + "'\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":0},"end":{"line":52,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":0},"end":{"line":61,"column":7}}})) != null ? stack1 : "")
    + "\n      - name: Build\n        run: npm run "
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":64,"column":21},"end":{"line":64,"column":36}}}) : helper)))
    + "\n\n      - name: Azure Login\n        uses: azure/login@v2\n        with:\n          creds: ${{ secrets.AZURE_CREDENTIALS }}\n\n      - name: Clear storage\n        run: |\n          az storage blob delete-batch \\\n            --account-name "
    + alias4(((helper = (helper = lookupProperty(helpers,"storageAccountName") || (depth0 != null ? lookupProperty(depth0,"storageAccountName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storageAccountName","hash":{},"data":data,"loc":{"start":{"line":74,"column":27},"end":{"line":74,"column":49}}}) : helper)))
    + " \\\n            --source '$web'\n\n      - name: Deploy to storage\n        run: |\n          az storage blob upload-batch \\\n            --account-name "
    + alias4(((helper = (helper = lookupProperty(helpers,"storageAccountName") || (depth0 != null ? lookupProperty(depth0,"storageAccountName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storageAccountName","hash":{},"data":data,"loc":{"start":{"line":80,"column":27},"end":{"line":80,"column":49}}}) : helper)))
    + " \\\n            --destination '$web' \\\n            --source './"
    + alias4(((helper = (helper = lookupProperty(helpers,"distFolder") || (depth0 != null ? lookupProperty(depth0,"distFolder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distFolder","hash":{},"data":data,"loc":{"start":{"line":82,"column":24},"end":{"line":82,"column":38}}}) : helper)))
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasBrowserSubfolder") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":82,"column":38},"end":{"line":82,"column":80}}})) != null ? stack1 : "")
    + "' \\\n            --destination-path '"
    + alias4(((helper = (helper = lookupProperty(helpers,"deploymentPath") || (depth0 != null ? lookupProperty(depth0,"deploymentPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"deploymentPath","hash":{},"data":data,"loc":{"start":{"line":83,"column":32},"end":{"line":83,"column":50}}}) : helper)))
    + "' \\\n            --pattern '*.*'\n\n          az storage blob upload-batch \\\n            --account-name "
    + alias4(((helper = (helper = lookupProperty(helpers,"storageAccountName") || (depth0 != null ? lookupProperty(depth0,"storageAccountName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"storageAccountName","hash":{},"data":data,"loc":{"start":{"line":87,"column":27},"end":{"line":87,"column":49}}}) : helper)))
    + " \\\n            --destination '$web' \\\n            --source './"
    + alias4(((helper = (helper = lookupProperty(helpers,"distFolder") || (depth0 != null ? lookupProperty(depth0,"distFolder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distFolder","hash":{},"data":data,"loc":{"start":{"line":89,"column":24},"end":{"line":89,"column":38}}}) : helper)))
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasBrowserSubfolder") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":89,"column":38},"end":{"line":89,"column":80}}})) != null ? stack1 : "")
    + "' \\\n            --pattern '*.*'\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasProtectedPaths") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":91,"column":0},"end":{"line":99,"column":7}}})) != null ? stack1 : "");
},"useData":true}),
  "github-actions/gha-swa.yml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  push:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":26}}}) : helper)))
    + " ]\n";
},"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  pull_request:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":10,"column":26}}}) : helper)))
    + " ]\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "  workflow_dispatch:\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  schedule:\n    - cron: '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cronExpression") || (depth0 != null ? lookupProperty(depth0,"cronExpression") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cronExpression","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":31}}}) : helper)))
    + "'\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":0},"end":{"line":39,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":0},"end":{"line":47,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":0},"end":{"line":51,"column":7}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — TypeScript check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — ESLint\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Unit tests\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Format check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Replace tokens\n        uses: cschleiden/replace-tokens@v1\n        with:\n          files: '[\""
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"envFilePath") || (depth0 != null ? lookupProperty(depth0,"envFilePath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"envFilePath","hash":{},"data":data,"loc":{"start":{"line":57,"column":20},"end":{"line":57,"column":35}}}) : helper)))
    + "\"]'\n        env:\n          ENCRYPTION_IV: ${{ secrets.ENCRYPTION_IV }}\n          ENCRYPTION_KEY: ${{ secrets.ENCRYPTION_KEY }}\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "/browser";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":22}}}) : helper)))
    + "\n\non:\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"push") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"pr") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"manual") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"schedule") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '"
    + alias4(((helper = (helper = lookupProperty(helpers,"nodeVersion") || (depth0 != null ? lookupProperty(depth0,"nodeVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeVersion","hash":{},"data":data,"loc":{"start":{"line":29,"column":25},"end":{"line":29,"column":40}}}) : helper)))
    + "'\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":0},"end":{"line":52,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":0},"end":{"line":61,"column":7}}})) != null ? stack1 : "")
    + "\n      - name: Build\n        run: npm run "
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":64,"column":21},"end":{"line":64,"column":36}}}) : helper)))
    + "\n\n      - name: Deploy to Static Web App\n        uses: Azure/static-web-apps-deploy@v1\n        with:\n          azure_static_web_apps_api_token: ${{ secrets."
    + alias4(((helper = (helper = lookupProperty(helpers,"swaSecretName") || (depth0 != null ? lookupProperty(depth0,"swaSecretName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"swaSecretName","hash":{},"data":data,"loc":{"start":{"line":69,"column":56},"end":{"line":69,"column":73}}}) : helper)))
    + " }}\n          repo_token: ${{ secrets.GITHUB_TOKEN }}\n          action: upload\n          app_location: "
    + alias4(((helper = (helper = lookupProperty(helpers,"distFolder") || (depth0 != null ? lookupProperty(depth0,"distFolder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distFolder","hash":{},"data":data,"loc":{"start":{"line":72,"column":24},"end":{"line":72,"column":38}}}) : helper)))
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasBrowserSubfolder") : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":72,"column":38},"end":{"line":72,"column":80}}})) != null ? stack1 : "")
    + "\n          skip_app_build: true\n";
},"useData":true}),
  "github-actions/gha-vercel.yml.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  push:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":6,"column":16},"end":{"line":6,"column":26}}}) : helper)))
    + " ]\n";
},"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  pull_request:\n    branches: [ "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"branch") || (depth0 != null ? lookupProperty(depth0,"branch") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"branch","hash":{},"data":data,"loc":{"start":{"line":10,"column":16},"end":{"line":10,"column":26}}}) : helper)))
    + " ]\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "  workflow_dispatch:\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  schedule:\n    - cron: '"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cronExpression") || (depth0 != null ? lookupProperty(depth0,"cronExpression") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cronExpression","hash":{},"data":data,"loc":{"start":{"line":17,"column":13},"end":{"line":17,"column":31}}}) : helper)))
    + "'\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":36,"column":0},"end":{"line":39,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":40,"column":0},"end":{"line":43,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":44,"column":0},"end":{"line":47,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":0},"end":{"line":51,"column":7}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Type check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"typescript") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Lint\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"lint") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Unit tests\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"tests") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Quality Gate — Format check\n        run: "
    + container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"format") : stack1)) != null ? lookupProperty(stack1,"command") : stack1), depth0))
    + "\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"tokenMappings") : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":54,"column":0},"end":{"line":58,"column":9}}})) != null ? stack1 : "");
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      - name: Replace token — "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0))
    + "\n        run: |\n          find . -path ./node_modules -prune -o -name \"*.ts\" -print | xargs sed -i 's/#"
    + ((stack1 = alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0)) != null ? stack1 : "")
    + "#/${{ secrets."
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"variableName") : depth0), depth0))
    + " }}/g' 2>/dev/null || true\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "/browser";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "name: "
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":1,"column":6},"end":{"line":1,"column":22}}}) : helper)))
    + "\n\non:\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"push") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":0},"end":{"line":7,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"pr") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":8,"column":0},"end":{"line":11,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"manual") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":12,"column":0},"end":{"line":14,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"triggers") : depth0)) != null ? lookupProperty(stack1,"schedule") : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":15,"column":0},"end":{"line":18,"column":7}}})) != null ? stack1 : "")
    + "\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '"
    + alias4(((helper = (helper = lookupProperty(helpers,"nodeVersion") || (depth0 != null ? lookupProperty(depth0,"nodeVersion") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"nodeVersion","hash":{},"data":data,"loc":{"start":{"line":29,"column":25},"end":{"line":29,"column":40}}}) : helper)))
    + "'\n          cache: 'npm'\n\n      - name: Install dependencies\n        run: npm ci\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"qualityGates") : depth0)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":35,"column":0},"end":{"line":52,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":0},"end":{"line":59,"column":7}}})) != null ? stack1 : "")
    + "\n      - name: Build\n        run: npm run "
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":62,"column":21},"end":{"line":62,"column":36}}}) : helper)))
    + "\n\n      - name: Deploy to Vercel\n        uses: amondnet/vercel-action@v25\n        with:\n          vercel-token: ${{ secrets.VERCEL_TOKEN }}\n          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}\n          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}\n          working-directory: ./"
    + alias4(((helper = (helper = lookupProperty(helpers,"distFolder") || (depth0 != null ? lookupProperty(depth0,"distFolder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"distFolder","hash":{},"data":data,"loc":{"start":{"line":70,"column":31},"end":{"line":70,"column":45}}}) : helper)))
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"hasBrowserSubfolder") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":70,"column":45},"end":{"line":70,"column":87}}})) != null ? stack1 : "")
    + "\n";
},"useData":true}),
  "github-actions/secrets-guide.md.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    return "## Azure Credentials\n\n| Secret Name | Value |\n|---|---|\n| `AZURE_CREDENTIALS` | JSON output of: `az ad sp create-for-rbac --sdk-auth` |\n";
},"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "## Token Replacement Secrets\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"tokenMappings") : depth0)) != null ? lookupProperty(stack1,"length") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data,"loc":{"start":{"line":31,"column":0},"end":{"line":39,"column":7}}})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "| Secret Name | Description |\n|---|---|\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"tokenMappings") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":0},"end":{"line":36,"column":9}}})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "| `"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"variableName") : depth0), depth0))
    + "` | Value to replace `"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"tokenName") : depth0), depth0))
    + "` in environment files |\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "Add your environment token values as repository secrets.\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "## Storage Account\n\nNo additional secrets needed — deployment uses `AZURE_CREDENTIALS`.\n";
},"6":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "## Static Web App Tokens\n\n| Secret Name | Value |\n|---|---|\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"swaSecrets") : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":53,"column":0},"end":{"line":55,"column":9}}})) != null ? stack1 : "");
},"7":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "| `"
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"secretName") : depth0), depth0))
    + "` | SWA deployment token from Azure Portal → Static Web Apps → "
    + alias2(alias1((depth0 != null ? lookupProperty(depth0,"label") : depth0), depth0))
    + " → Manage deployment token |\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "## App Service\n\n| Secret Name | Value |\n|---|---|\n| `AZURE_WEBAPP_PUBLISH_PROFILE` | Publish profile XML from Azure Portal → App Service → Download publish profile |\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "## FTP / cPanel Credentials\n\n| Secret Name | Value |\n|---|---|\n| `FTP_SERVER` | Your FTP hostname (e.g. `ftp.yourdomain.com`) — found in cPanel → FTP Accounts |\n| `FTP_USERNAME` | Your FTP username (e.g. `deploy@yourdomain.com`) |\n| `FTP_PASSWORD` | Your FTP password |\n\n> **Security note:** Never store FTP credentials in your code or PipeForge.\n> Add them directly to GitHub: **Settings → Secrets and variables → Actions → New repository secret**\n\n### Where to find FTP credentials\n\n| Hosting Provider | Location |\n|---|---|\n| **SiteGround** | Site Tools → FTP Accounts |\n| **Hostinger** | hPanel → Files → FTP Accounts |\n| **GoDaddy** | cPanel → FTP Accounts |\n| **Bluehost** | cPanel → FTP Accounts |\n| **Namecheap** | cPanel → FTP Accounts |\n\nWe recommend creating a dedicated FTP account for deployments with access limited to your site directory.\n";
},"10":function(container,depth0,helpers,partials,data) {
    return "## Vercel Secrets\n\n| Secret Name | Value |\n|---|---|\n| `VERCEL_TOKEN` | Vercel account token from vercel.com → Settings → Tokens |\n| `VERCEL_ORG_ID` | Found in vercel.com → Settings → General |\n| `VERCEL_PROJECT_ID` | Found in your Vercel project settings |\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "## Netlify Secrets\n\n| Secret Name | Value |\n|---|---|\n| `NETLIFY_AUTH_TOKEN` | Netlify personal access token from app.netlify.com → User settings → Applications |\n| `NETLIFY_SITE_ID` | Your Netlify site ID (found in Site settings → General → Site ID) |\n";
},"12":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "## Firebase Secrets\n\n| Secret Name | Value |\n|---|---|\n| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON — Firebase Console → Project Settings → Service accounts → Generate new private key |\n\n**Project ID configured:** `"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"firebaseProjectId") || (depth0 != null ? lookupProperty(depth0,"firebaseProjectId") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"firebaseProjectId","hash":{},"data":data,"loc":{"start":{"line":117,"column":28},"end":{"line":117,"column":49}}}) : helper)))
    + "`\n\n> The service account requires the **Firebase Hosting Admin** role.\n";
},"13":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "## GitHub Pages\n\nNo additional secrets required. GitHub Pages uses `GITHUB_TOKEN` which is automatically provided by GitHub Actions.\n\n**Publish branch configured:** `"
    + alias4(((helper = (helper = lookupProperty(helpers,"ghPagesBranch") || (depth0 != null ? lookupProperty(depth0,"ghPagesBranch") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ghPagesBranch","hash":{},"data":data,"loc":{"start":{"line":127,"column":32},"end":{"line":127,"column":49}}}) : helper)))
    + "`\n\n> Ensure GitHub Pages is enabled in your repository: Settings → Pages → Source → Deploy from a branch → `"
    + alias4(((helper = (helper = lookupProperty(helpers,"ghPagesBranch") || (depth0 != null ? lookupProperty(depth0,"ghPagesBranch") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ghPagesBranch","hash":{},"data":data,"loc":{"start":{"line":129,"column":105},"end":{"line":129,"column":122}}}) : helper)))
    + "`\n";
},"14":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "## Cloudflare Pages Secrets\n\n| Secret Name | Value |\n|---|---|\n| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Cloudflare Pages edit permissions |\n| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID (found in the Cloudflare dashboard sidebar) |\n\n**Pages project configured:** `"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"cloudflarePagesProject") || (depth0 != null ? lookupProperty(depth0,"cloudflarePagesProject") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"cloudflarePagesProject","hash":{},"data":data,"loc":{"start":{"line":140,"column":31},"end":{"line":140,"column":57}}}) : helper)))
    + "`\n\n> Create the Cloudflare Pages project first in the Cloudflare dashboard before deploying.\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "# GitHub Secrets Required for "
    + alias4(((helper = (helper = lookupProperty(helpers,"projectName") || (depth0 != null ? lookupProperty(depth0,"projectName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"projectName","hash":{},"data":data,"loc":{"start":{"line":1,"column":30},"end":{"line":1,"column":45}}}) : helper)))
    + "\n\nAdd these secrets to your GitHub repository:\n**Settings → Secrets and variables → Actions → New repository secret**\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"storage-account",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":6,"column":6},"end":{"line":6,"column":41}}}),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":6,"column":0},"end":{"line":12,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"static-web-app",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":13,"column":6},"end":{"line":13,"column":40}}}),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":13,"column":0},"end":{"line":19,"column":7}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"app-service",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":20,"column":6},"end":{"line":20,"column":37}}}),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":20,"column":0},"end":{"line":26,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"useTokenReplacement") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":28,"column":0},"end":{"line":40,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"storage-account",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":42,"column":6},"end":{"line":42,"column":41}}}),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":42,"column":0},"end":{"line":46,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"static-web-app",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":48,"column":6},"end":{"line":48,"column":40}}}),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":48,"column":0},"end":{"line":56,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"app-service",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":58,"column":6},"end":{"line":58,"column":37}}}),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":58,"column":0},"end":{"line":64,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"ftp-cpanel",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":66,"column":6},"end":{"line":66,"column":36}}}),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":66,"column":0},"end":{"line":89,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"vercel",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":91,"column":6},"end":{"line":91,"column":32}}}),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":91,"column":0},"end":{"line":99,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"netlify",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":101,"column":6},"end":{"line":101,"column":33}}}),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":101,"column":0},"end":{"line":108,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"firebase",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":110,"column":6},"end":{"line":110,"column":34}}}),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":110,"column":0},"end":{"line":120,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"github-pages",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":122,"column":6},"end":{"line":122,"column":38}}}),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":122,"column":0},"end":{"line":130,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(lookupProperty(helpers,"eq")||(depth0 && lookupProperty(depth0,"eq"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"deployTarget") : depth0),"cloudflare-pages",{"name":"eq","hash":{},"data":data,"loc":{"start":{"line":132,"column":6},"end":{"line":132,"column":42}}}),{"name":"if","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":132,"column":0},"end":{"line":143,"column":7}}})) != null ? stack1 : "")
    + "\n---\n*Generated by PipeForge on "
    + alias4(((helper = (helper = lookupProperty(helpers,"generatedAt") || (depth0 != null ? lookupProperty(depth0,"generatedAt") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"generatedAt","hash":{},"data":data,"loc":{"start":{"line":146,"column":27},"end":{"line":146,"column":42}}}) : helper)))
    + "*\n";
},"useData":true}),
  "readme.md.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    return "/browser";
},"1":function(container,depth0,helpers,partials,data) {
    return "Yes";
},"2":function(container,depth0,helpers,partials,data) {
    return "No";
},"3":function(container,depth0,helpers,partials,data) {
    return "- `"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "`\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "| "
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":35,"column":2},"end":{"line":35,"column":10}}}) : helper)))
    + " | `"
    + alias4(((helper = (helper = lookupProperty(helpers,"code") || (depth0 != null ? lookupProperty(depth0,"code") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"code","hash":{},"data":data,"loc":{"start":{"line":35,"column":14},"end":{"line":35,"column":22}}}) : helper)))
    + "` | "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"enabled") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(6, data, 0),"data":data,"loc":{"start":{"line":35,"column":26},"end":{"line":35,"column":71}}})) != null ? stack1 : "")
    + " |\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "Enabled";
},"6":function(container,depth0,helpers,partials,data) {
    return "Disabled";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "### Languages\n\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"languages") : stack1),{"name":"each","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":41,"column":0},"end":{"line":43,"column":9}}})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "- **"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":42,"column":4},"end":{"line":42,"column":12}}}) : helper)))
    + "** (`"
    + alias4(((helper = (helper = lookupProperty(helpers,"code") || (depth0 != null ? lookupProperty(depth0,"code") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"code","hash":{},"data":data,"loc":{"start":{"line":42,"column":17},"end":{"line":42,"column":25}}}) : helper)))
    + "`)\n";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "Example: `QA-SAUDI-"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"projectName") : stack1), depth0))
    + "-EN`\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "Example: `QA-SAUDI-"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"projectName") : stack1), depth0))
    + "`\n";
},"11":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3=container.escapeExpression, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "| "
    + alias3((lookupProperty(helpers,"addOne")||(depth0 && lookupProperty(depth0,"addOne"))||alias2).call(alias1,(data && lookupProperty(data,"index")),{"name":"addOne","hash":{},"data":data,"loc":{"start":{"line":71,"column":2},"end":{"line":71,"column":19}}}))
    + " | `"
    + alias3(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":71,"column":23},"end":{"line":71,"column":31}}}) : helper)))
    + "` | "
    + alias3(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":71,"column":35},"end":{"line":71,"column":43}}}) : helper)))
    + " | `"
    + alias3(((helper = (helper = lookupProperty(helpers,"path") || (depth0 != null ? lookupProperty(depth0,"path") : depth0)) != null ? helper : alias2),(typeof helper === alias4 ? helper.call(alias1,{"name":"path","hash":{},"data":data,"loc":{"start":{"line":71,"column":47},"end":{"line":71,"column":55}}}) : helper)))
    + "` |\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "Language | ";
},"13":function(container,depth0,helpers,partials,data) {
    return "---------|";
},"14":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "| `"
    + alias4(((helper = (helper = lookupProperty(helpers,"pipelineName") || (depth0 != null ? lookupProperty(depth0,"pipelineName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pipelineName","hash":{},"data":data,"loc":{"start":{"line":83,"column":3},"end":{"line":83,"column":19}}}) : helper)))
    + "` | "
    + alias4(((helper = (helper = lookupProperty(helpers,"environment") || (depth0 != null ? lookupProperty(depth0,"environment") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"environment","hash":{},"data":data,"loc":{"start":{"line":83,"column":23},"end":{"line":83,"column":38}}}) : helper)))
    + " | "
    + alias4(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"market") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + " | "
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depths[1] != null ? lookupProperty(depths[1],"config") : depths[1])) != null ? lookupProperty(stack1,"isMultiLanguage") : stack1),{"name":"if","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":83,"column":59},"end":{"line":83,"column":119}}})) != null ? stack1 : "")
    + "`"
    + alias4(((helper = (helper = lookupProperty(helpers,"branchName") || (depth0 != null ? lookupProperty(depth0,"branchName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"branchName","hash":{},"data":data,"loc":{"start":{"line":83,"column":120},"end":{"line":83,"column":134}}}) : helper)))
    + "` | `"
    + alias4(((helper = (helper = lookupProperty(helpers,"buildScript") || (depth0 != null ? lookupProperty(depth0,"buildScript") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"buildScript","hash":{},"data":data,"loc":{"start":{"line":83,"column":139},"end":{"line":83,"column":154}}}) : helper)))
    + "` |\n";
},"15":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"language") : depth0)) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + " | ";
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "### Token Replacement\n\nToken replacement is **enabled** for this project.\n\n- **Environment file**: `"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"environmentFilePath") : stack1), depth0))
    + "`\n- **Secret variable names**: `"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"secretVariableNames") : stack1), depth0))
    + "`\n\nThe `FileTransform@2` task is included in build pipelines. Ensure all secret variables listed above are defined as secret pipeline variables before running a build.\n";
},"17":function(container,depth0,helpers,partials,data) {
    return "### Token Replacement\n\nToken replacement is **disabled** for this project. No `FileTransform` task is included in the build pipelines.\n";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "### Downstream Pipeline Trigger\n\nAfter each successful deployment, a downstream pipeline trigger is configured.\n\n- **Trigger Pipeline ID**: `"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"triggerPipelineId") : stack1), depth0))
    + "`\n\nEnsure the `System.AccessToken` has permission to queue builds in the target pipeline.\n";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "### Protected Files Setup\n\nCertain files are preserved across deployments by backing them up to a separate container and restoring after each deploy.\n\n**Backup container:** `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"protectedPathsContainer") : stack1), depth0))
    + "`\n\n**Protected paths:**\n"
    + ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"protectedPaths") : stack1),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":156,"column":0},"end":{"line":158,"column":9}}})) != null ? stack1 : "")
    + "\n**One-time setup** — create the backup container and upload your protected files:\n\n```bash\n# Create the backup container\naz storage container create \\\n  --name '"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"protectedPathsContainer") : stack1), depth0))
    + "' \\\n  --account-name <YOUR_STORAGE_ACCOUNT>\n\n# Upload each protected file (repeat for each path)\naz storage blob upload \\\n  --container-name '"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"protectedPathsContainer") : stack1), depth0))
    + "' \\\n  --name '<PATH>' \\\n  --file '<LOCAL_FILE>' \\\n  --account-name <YOUR_STORAGE_ACCOUNT>\n```\n\nAfter setup, every deployment will automatically restore these files from the backup container to `$web`.\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "# "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"projectName") : stack1), depth0))
    + " — Azure DevOps Pipelines\n\n> Generated by **PipeForge** on "
    + alias2(((helper = (helper = lookupProperty(helpers,"generatedAt") || (depth0 != null ? lookupProperty(depth0,"generatedAt") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias3,{"name":"generatedAt","hash":{},"data":data,"loc":{"start":{"line":3,"column":32},"end":{"line":3,"column":47}}}) : helper)))
    + "\n\n---\n\n## Project Overview\n\n| Field | Value |\n|-------|-------|\n| **Project Name** | `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"projectName") : stack1), depth0))
    + "` |\n| **Repository** | `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"repositoryName") : stack1), depth0))
    + "` |\n| **ADO Organization** | `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoOrganization") : stack1), depth0))
    + "` |\n| **ADO Project** | `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + "` |\n| **Node Version** | `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"nodeVersion") : stack1), depth0))
    + "` |\n| **Dist Folder** | `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"distFolder") : stack1), depth0))
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"hasBrowserSubfolder") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":16,"column":42},"end":{"line":16,"column":91}}})) != null ? stack1 : "")
    + "` |\n| **Deploy Target** | `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"deployTarget") : stack1), depth0))
    + "` |\n| **Multi-Language** | `"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"isMultiLanguage") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(2, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":18,"column":24},"end":{"line":18,"column":74}}})) != null ? stack1 : "")
    + "` |\n\n---\n\n## Scope\n\n### Environments\n\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"environments") : stack1),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":0},"end":{"line":28,"column":9}}})) != null ? stack1 : "")
    + "\n### Markets\n\n| Name | Code | Status |\n|------|------|--------|\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"markets") : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":34,"column":0},"end":{"line":36,"column":9}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"isMultiLanguage") : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":38,"column":0},"end":{"line":44,"column":7}}})) != null ? stack1 : "")
    + "\n---\n\n## Pipeline Naming Convention\n\nAll pipelines follow the pattern:\n\n```\n{ENV}-{MARKET}-{MFE}-{LANG}\n```\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"isMultiLanguage") : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.program(10, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":56,"column":0},"end":{"line":60,"column":7}}})) != null ? stack1 : "")
    + "\n---\n\n## Generated Files\n\nThe following "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"generatedFiles") : depth0)) != null ? lookupProperty(stack1,"length") : stack1), depth0))
    + " files were generated:\n\n| # | File Name | Type | Path |\n|---|-----------|------|------|\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"generatedFiles") : depth0),{"name":"each","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":70,"column":0},"end":{"line":72,"column":9}}})) != null ? stack1 : "")
    + "\n---\n\n## Pipeline Combinations\n\nEach combination maps to one build pipeline and one release pipeline:\n\n| Pipeline Name | Environment | Market | "
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"isMultiLanguage") : stack1),{"name":"if","hash":{},"fn":container.program(12, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":80,"column":41},"end":{"line":80,"column":89}}})) != null ? stack1 : "")
    + "Branch | Build Script |\n|---------------|-------------|--------|"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"isMultiLanguage") : stack1),{"name":"if","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":81,"column":40},"end":{"line":81,"column":87}}})) != null ? stack1 : "")
    + "--------|--------------|\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias3,(depth0 != null ? lookupProperty(depth0,"combinations") : depth0),{"name":"each","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":82,"column":0},"end":{"line":84,"column":9}}})) != null ? stack1 : "")
    + "\n---\n\n## How to Import into Azure DevOps\n\n### YAML Pipelines (build-pipeline.yaml)\n\n1. In Azure DevOps, navigate to **Pipelines > Pipelines**.\n2. Click **New pipeline**.\n3. Select **Azure Repos Git** (or your repository source).\n4. Choose **Existing Azure Pipelines YAML file**.\n5. Select the branch and point to the generated `.yaml` file.\n6. Click **Continue**, then **Save and run**.\n\n### Classic JSON Pipelines (build-pipeline.json / release-*.json)\n\n#### Build (Classic JSON)\n\n1. Navigate to **Pipelines > Pipelines**.\n2. Click **New pipeline** and switch to the Classic Editor.\n3. Use the **Import** option (three-dot menu) to upload the `build-pipeline.json` file.\n4. Review the imported pipeline, fix any pending service connection references, and save.\n\n#### Release (Classic JSON)\n\n1. Navigate to **Pipelines > Releases**.\n2. Click **New** > **Import release pipeline**.\n3. Upload the `release-*.json` file for the corresponding combination.\n4. After importing:\n   - Re-link the artifact source to the correct build pipeline.\n   - Verify service connection `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "` is accessible.\n   - Set any secret variable values (they are not exported in the JSON).\n5. Save and create a release to validate the configuration.\n\n---\n\n## Configuration Notes\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"tokenReplacement") : stack1)) != null ? lookupProperty(stack1,"enabled") : stack1),{"name":"if","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.program(17, data, 0, blockParams, depths),"data":data,"loc":{"start":{"line":123,"column":0},"end":{"line":136,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"triggerPipelineAfterDeploy") : stack1),{"name":"if","hash":{},"fn":container.program(18, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":138,"column":0},"end":{"line":146,"column":7}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"protectedPaths") : stack1)) != null ? lookupProperty(stack1,"length") : stack1),{"name":"if","hash":{},"fn":container.program(19, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":148,"column":0},"end":{"line":177,"column":7}}})) != null ? stack1 : "")
    + "\n### Service Connection\n\nAll Azure tasks reference service connection: **`"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "`**\n\nVerify this service connection exists in your ADO project under **Project Settings > Service connections** before importing any pipeline.\n\n---\n\n## QA vs Production Branches\n\n| Environment | Branch |\n|-------------|--------|\n| QA | `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"qaBranch") : stack1), depth0))
    + "` |\n| PROD | `"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"productionBranch") : stack1), depth0))
    + "` |\n\n---\n\n## Troubleshooting\n\n### Pipeline fails on npm ci\n\nThis usually means your package-lock.json is out of sync with package.json.\n\nResolution:\n  1. Delete package-lock.json from your project root\n  2. Delete the node_modules folder\n  3. Run: npm install\n  4. Commit the newly generated package-lock.json\n  5. Push and re-run the pipeline\n\nWhy npm ci instead of npm install?\nnpm ci is faster and stricter in CI environments. It fails immediately\nif package-lock.json is missing or out of sync, providing a clear signal.\nAlways commit your package-lock.json to the repository.\n\n---\n\n*This README was auto-generated by PipeForge. Do not edit manually — regenerate from the PipeForge wizard if changes are needed.*\n";
},"useData":true,"useDepths":true}),
  "release-appservice.json.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ",\n\n            {\n              \"taskId\": \"9c3e8943-130d-4c78-ac63-8af81df62dfb\",\n              \"version\": \"0.*\",\n              \"name\": \"Trigger downstream pipeline\",\n              \"refName\": \"TriggerDownstreamPipeline\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"waitForCompletion\": \"false\",\n                \"buildDefinition\": \""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"triggerPipelineId") : stack1), depth0))
    + "\",\n                \"queueBuildForUserThatTriggeredBuild\": \"true\",\n                \"ignoreSslCertificateErrors\": \"false\",\n                \"useSameSourceVersion\": \"false\",\n                \"useCustomSourceVersion\": \"false\",\n                \"buildParameters\": \"\",\n                \"storeInEnvironment\": \"false\",\n                \"authenticationMethod\": \"OAuth Token\",\n                \"password\": \"$(System.AccessToken)\",\n                \"enableSecureParameters\": \"false\"\n              }\n            }";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  \"id\": -1,\n  \"name\": \"RELEASE-"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n  \"type\": 1,\n  \"quality\": 1,\n  \"path\": \"\\\\\",\n  \"createdOn\": \""
    + alias2(((helper = (helper = lookupProperty(helpers,"generatedAt") || (depth0 != null ? lookupProperty(depth0,"generatedAt") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"generatedAt","hash":{},"data":data,"loc":{"start":{"line":7,"column":16},"end":{"line":7,"column":31}}}) : helper)))
    + "\",\n  \"project\": {\n    \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + "\"\n  },\n  \"variables\": {\n    \"appServiceName\": {\n      \"value\": \""
    + alias2(((helper = (helper = lookupProperty(helpers,"appServiceName") || (depth0 != null ? lookupProperty(depth0,"appServiceName") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"appServiceName","hash":{},"data":data,"loc":{"start":{"line":13,"column":16},"end":{"line":13,"column":34}}}) : helper)))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    },\n    \"deploymentPath\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"deploymentPath") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    },\n    \"projectName\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"projectName") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    },\n    \"serviceConnectionId\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    }\n  },\n  \"variableGroups\": [],\n  \"environments\": [\n    {\n      \"id\": 1,\n      \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"environment") : stack1), depth0))
    + "\",\n      \"rank\": 1,\n      \"owner\": {\n        \"displayName\": \"PipeForge\"\n      },\n      \"variables\": {},\n      \"variableGroups\": [],\n      \"preDeployApprovals\": {\n        \"approvals\": [\n          {\n            \"rank\": 1,\n            \"isAutomated\": true,\n            \"isNotificationOn\": false\n          }\n        ],\n        \"approvalOptions\": {\n          \"requiredApproverCount\": null,\n          \"releaseCreatorCanBeApprover\": false,\n          \"autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped\": false,\n          \"enforceIdentityRevalidation\": false,\n          \"timeoutInMinutes\": 0,\n          \"executionOrder\": 1\n        }\n      },\n      \"postDeployApprovals\": {\n        \"approvals\": [\n          {\n            \"rank\": 1,\n            \"isAutomated\": true,\n            \"isNotificationOn\": false\n          }\n        ],\n        \"approvalOptions\": {\n          \"requiredApproverCount\": null,\n          \"releaseCreatorCanBeApprover\": false,\n          \"autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped\": false,\n          \"enforceIdentityRevalidation\": false,\n          \"timeoutInMinutes\": 0,\n          \"executionOrder\": 2\n        }\n      },\n      \"deployPhases\": [\n        {\n          \"deploymentInput\": {\n            \"parallelExecution\": {\n              \"parallelExecutionType\": 0\n            },\n            \"agentSpecification\": {\n              \"identifier\": \"ubuntu-latest\"\n            },\n            \"skipArtifactsDownload\": false,\n            \"artifactsDownloadInput\": {\n              \"downloadInputs\": [\n                {\n                  \"artifactItems\": [],\n                  \"alias\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n                  \"artifactType\": \"Build\",\n                  \"artifactDownloadMode\": \"All\"\n                }\n              ]\n            },\n            \"queueId\": 0,\n            \"demands\": [],\n            \"enableAccessToken\": false,\n            \"timeoutInMinutes\": 0,\n            \"jobCancelTimeoutInMinutes\": 1,\n            \"condition\": \"succeeded()\",\n            \"overrideInputs\": {}\n          },\n          \"rank\": 1,\n          \"phaseType\": 1,\n          \"name\": \"Agent job\",\n          \"refName\": \"Job_1\",\n          \"workflowTasks\": [\n\n            {\n              \"taskId\": \"497d490f-eea7-4f2b-ab94-48d9c1acdcb1\",\n              \"version\": \"4.*\",\n              \"name\": \"Azure App Service Deploy — "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n              \"refName\": \"AzureRmWebAppDeployment\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"ConnectionType\": \"AzureRM\",\n                \"ConnectedServiceName\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "\",\n                \"PublishProfilePath\": \"$(System.DefaultWorkingDirectory)/**/*.pubxml\",\n                \"PublishProfilePassword\": \"\",\n                \"WebAppKind\": \"webApp\",\n                \"WebAppName\": \"$(appServiceName)\",\n                \"DeployToSlotOrASEFlag\": \"false\",\n                \"ResourceGroupName\": \"\",\n                \"SlotName\": \"production\",\n                \"VirtualApplication\": \"\",\n                \"Package\": \"$(System.DefaultWorkingDirectory)/"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "/**/*.zip\",\n                \"packageForLinux\": \"$(System.DefaultWorkingDirectory)/"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "/**/*.zip\",\n                \"RuntimeStack\": \"\",\n                \"StartupCommand\": \"\",\n                \"ScriptType\": \"\",\n                \"InlineScript\": \":: You can provide your deployment commands here. One command per line.\",\n                \"WebConfigParameters\": \"\",\n                \"AppSettings\": \"\",\n                \"ConfigurationSettings\": \"\",\n                \"enableCustomDeployment\": \"false\",\n                \"DeploymentType\": \"webDeploy\",\n                \"TakeAppOfflineFlag\": \"true\",\n                \"UseWebDeploy\": \"false\",\n                \"ExcludeFilesFromAppDataFlag\": \"true\",\n                \"AdditionalArguments\": \"-retryAttempts:6 -retryInterval:10000\",\n                \"RenameFilesFlag\": \"true\",\n                \"RemoveAdditionalFilesFlag\": \"false\",\n                \"enableXmlTransform\": \"false\",\n                \"enableXmlVariableSubstitution\": \"false\",\n                \"JSONFiles\": \"\"\n              }\n            }"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"triggerPipelineAfterDeploy") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":158,"column":13},"end":{"line":187,"column":20}}})) != null ? stack1 : "")
    + "\n\n          ]\n        }\n      ],\n      \"environmentOptions\": {\n        \"emailNotificationType\": \"OnlyOnFailure\",\n        \"emailRecipients\": \"release.environment.owner;release.creator\",\n        \"skipArtifactsDownload\": false,\n        \"timeoutInMinutes\": 0,\n        \"enableAccessToken\": false,\n        \"publishDeploymentStatus\": true,\n        \"badgeEnabled\": false,\n        \"autoLinkWorkItems\": false,\n        \"pullRequestDeploymentEnabled\": false\n      },\n      \"demands\": [],\n      \"conditions\": [\n        {\n          \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n          \"conditionType\": 8,\n          \"value\": \"\"\n        }\n      ],\n      \"executionPolicy\": {\n        \"concurrencyCount\": 1,\n        \"queueDepthCount\": 0\n      },\n      \"schedules\": [],\n      \"retentionPolicy\": {\n        \"daysToKeep\": 30,\n        \"releasesToKeep\": 3,\n        \"retainBuild\": true\n      },\n      \"processParameters\": {},\n      \"properties\": {}\n    }\n  ],\n  \"artifacts\": [\n    {\n      \"sourceId\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + ":"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n      \"type\": \"Build\",\n      \"alias\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n      \"definitionReference\": {\n        \"artifactSourceDefinitionUrl\": {\n          \"id\": \"\",\n          \"name\": \"\"\n        },\n        \"defaultVersionType\": {\n          \"id\": \"latestType\",\n          \"name\": \"Latest\"\n        },\n        \"definition\": {\n          \"id\": \"\",\n          \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\"\n        },\n        \"project\": {\n          \"id\": \"\",\n          \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + "\"\n        }\n      },\n      \"isPrimary\": true,\n      \"isRetained\": false\n    }\n  ],\n  \"triggers\": [\n    {\n      \"artifactAlias\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n      \"triggerConditions\": [],\n      \"triggerType\": 1\n    }\n  ],\n  \"releaseNameFormat\": \"Release-$(rev:r)\",\n  \"tags\": [],\n  \"properties\": {}\n}\n";
},"useData":true}),
  "release-storage.json.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=container.hooks.helperMissing, alias4="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ",\n\n            {\n              \"taskId\": \"46e4be58-730b-88da-2d50-57f4867f51b1\",\n              \"version\": \"0.*\",\n              \"name\": \"Azure CLI — preserve files\",\n              \"refName\": \"AzureCLI_Preserve_Files\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"connectedServiceNameARM\": \""
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "\",\n                \"scriptType\": \"bash\",\n                \"scriptLocation\": \"inlineScript\",\n                \"inlineScript\": \"storageAccount=\\\"$(storageAccountName)\\\"\\nsourceContainer=\\\""
    + alias1(((helper = (helper = lookupProperty(helpers,"preserveSourceContainer") || (depth0 != null ? lookupProperty(depth0,"preserveSourceContainer") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"preserveSourceContainer","hash":{},"data":data,"loc":{"start":{"line":238,"column":93},"end":{"line":238,"column":120}}}) : helper)))
    + "\\\"\\ndestinationContainer=\\\""
    + alias1(((helper = (helper = lookupProperty(helpers,"preserveDestinationContainer") || (depth0 != null ? lookupProperty(depth0,"preserveDestinationContainer") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"preserveDestinationContainer","hash":{},"data":data,"loc":{"start":{"line":238,"column":147},"end":{"line":238,"column":179}}}) : helper)))
    + "\\\"\\ndestinationFolder=\\\""
    + alias1(((helper = (helper = lookupProperty(helpers,"preserveDestinationFolder") || (depth0 != null ? lookupProperty(depth0,"preserveDestinationFolder") : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"preserveDestinationFolder","hash":{},"data":data,"loc":{"start":{"line":238,"column":203},"end":{"line":238,"column":232}}}) : helper)))
    + "\\\"\\n\\nblob_list=$(az storage blob list --account-name $storageAccount --container-name $sourceContainer --query \\\"[].name\\\" --auth-mode login -o tsv | tr -d '\\\\r')\\n\\nif [ -z \\\"$blob_list\\\" ]; then\\n  echo \\\"No blobs found in '$sourceContainer'.\\\"\\nelse\\n  for blob in $blob_list; do\\n    az storage blob copy start --account-name $storageAccount --source-container $sourceContainer --source-blob \\\"$blob\\\" --destination-container $destinationContainer --destination-blob \\\"$destinationFolder/$blob\\\" --auth-mode login\\n  done\\n  echo \\\"All files copied successfully.\\\"\\nfi\",\n                \"addSpnToEnvironment\": \"false\",\n                \"useGlobalConfig\": \"false\",\n                \"cwd\": \"$(System.DefaultWorkingDirectory)\",\n                \"failOnStandardError\": \"false\",\n                \"visibleAzLogin\": \"true\"\n              }\n            }";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  \"id\": -1,\n  \"name\": \"RELEASE-"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n  \"type\": 1,\n  \"quality\": 1,\n  \"path\": \"\\\\\",\n  \"createdOn\": \""
    + alias2(((helper = (helper = lookupProperty(helpers,"generatedAt") || (depth0 != null ? lookupProperty(depth0,"generatedAt") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"generatedAt","hash":{},"data":data,"loc":{"start":{"line":7,"column":16},"end":{"line":7,"column":31}}}) : helper)))
    + "\",\n  \"project\": {\n    \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + "\"\n  },\n  \"variables\": {\n    \"storageAccountName\": {\n      \"value\": \""
    + alias2(((helper = (helper = lookupProperty(helpers,"storageAccountName") || (depth0 != null ? lookupProperty(depth0,"storageAccountName") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"storageAccountName","hash":{},"data":data,"loc":{"start":{"line":13,"column":16},"end":{"line":13,"column":38}}}) : helper)))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    },\n    \"deploymentPath\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"deploymentPath") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    },\n    \"projectName\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"projectName") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    },\n    \"serviceConnectionId\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    }\n  },\n  \"variableGroups\": [],\n  \"environments\": [\n    {\n      \"id\": 1,\n      \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"environment") : stack1), depth0))
    + "\",\n      \"rank\": 1,\n      \"owner\": {\n        \"displayName\": \"PipeForge\"\n      },\n      \"variables\": {},\n      \"variableGroups\": [],\n      \"preDeployApprovals\": {\n        \"approvals\": [\n          {\n            \"rank\": 1,\n            \"isAutomated\": true,\n            \"isNotificationOn\": false\n          }\n        ],\n        \"approvalOptions\": {\n          \"requiredApproverCount\": null,\n          \"releaseCreatorCanBeApprover\": false,\n          \"autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped\": false,\n          \"enforceIdentityRevalidation\": false,\n          \"timeoutInMinutes\": 0,\n          \"executionOrder\": 1\n        }\n      },\n      \"postDeployApprovals\": {\n        \"approvals\": [\n          {\n            \"rank\": 1,\n            \"isAutomated\": true,\n            \"isNotificationOn\": false\n          }\n        ],\n        \"approvalOptions\": {\n          \"requiredApproverCount\": null,\n          \"releaseCreatorCanBeApprover\": false,\n          \"autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped\": false,\n          \"enforceIdentityRevalidation\": false,\n          \"timeoutInMinutes\": 0,\n          \"executionOrder\": 2\n        }\n      },\n      \"deployPhases\": [\n        {\n          \"deploymentInput\": {\n            \"parallelExecution\": {\n              \"parallelExecutionType\": 0\n            },\n            \"agentSpecification\": {\n              \"identifier\": \"ubuntu-latest\"\n            },\n            \"skipArtifactsDownload\": false,\n            \"artifactsDownloadInput\": {\n              \"downloadInputs\": [\n                {\n                  \"artifactItems\": [],\n                  \"alias\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n                  \"artifactType\": \"Build\",\n                  \"artifactDownloadMode\": \"All\"\n                }\n              ]\n            },\n            \"queueId\": 0,\n            \"demands\": [],\n            \"enableAccessToken\": false,\n            \"timeoutInMinutes\": 0,\n            \"jobCancelTimeoutInMinutes\": 1,\n            \"condition\": \"succeeded()\",\n            \"overrideInputs\": {}\n          },\n          \"rank\": 1,\n          \"phaseType\": 1,\n          \"name\": \"Agent job\",\n          \"refName\": \"Job_1\",\n          \"workflowTasks\": [\n\n            {\n              \"taskId\": \"46e4be58-730b-88da-2d50-57f4867f51b1\",\n              \"version\": \"0.*\",\n              \"name\": \"Azure CLI — delete blobs at primary path\",\n              \"refName\": \"AzureCLI_Delete_Primary\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"connectedServiceNameARM\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "\",\n                \"scriptType\": \"bash\",\n                \"scriptLocation\": \"inlineScript\",\n                \"inlineScript\": \"az storage blob delete-batch --source '$web' --account-name $(storageAccountName) --pattern '$(deploymentPath)/*'\",\n                \"addSpnToEnvironment\": \"false\",\n                \"useGlobalConfig\": \"false\",\n                \"cwd\": \"$(System.DefaultWorkingDirectory)/"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n                \"failOnStandardError\": \"false\",\n                \"visibleAzLogin\": \"true\"\n              }\n            },\n\n            {\n              \"taskId\": \"46e4be58-730b-88da-2d50-57f4867f51b1\",\n              \"version\": \"0.*\",\n              \"name\": \"Azure CLI — upload blobs to primary path\",\n              \"refName\": \"AzureCLI_Upload_Primary\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"connectedServiceNameARM\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "\",\n                \"scriptType\": \"bash\",\n                \"scriptLocation\": \"inlineScript\",\n                \"inlineScript\": \"az storage blob upload-batch --destination '$web/$(deploymentPath)' --source . --account-name $(storageAccountName) --overwrite true\",\n                \"addSpnToEnvironment\": \"false\",\n                \"useGlobalConfig\": \"false\",\n                \"cwd\": \"$(System.DefaultWorkingDirectory)/"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n                \"failOnStandardError\": \"false\",\n                \"visibleAzLogin\": \"true\"\n              }\n            },\n\n            {\n              \"taskId\": \"46e4be58-730b-88da-2d50-57f4867f51b1\",\n              \"version\": \"0.*\",\n              \"name\": \"Azure CLI — delete blobs at versioned path\",\n              \"refName\": \"AzureCLI_Delete_Versioned\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"connectedServiceNameARM\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "\",\n                \"scriptType\": \"bash\",\n                \"scriptLocation\": \"inlineScript\",\n                \"inlineScript\": \"az storage blob delete-batch --source '$web' --account-name $(storageAccountName) --pattern 'v/$(deploymentPath)/*'\",\n                \"addSpnToEnvironment\": \"false\",\n                \"useGlobalConfig\": \"false\",\n                \"cwd\": \"$(System.DefaultWorkingDirectory)/"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n                \"failOnStandardError\": \"false\",\n                \"visibleAzLogin\": \"true\"\n              }\n            },\n\n            {\n              \"taskId\": \"46e4be58-730b-88da-2d50-57f4867f51b1\",\n              \"version\": \"0.*\",\n              \"name\": \"Azure CLI — upload blobs to versioned path\",\n              \"refName\": \"AzureCLI_Upload_Versioned\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"connectedServiceNameARM\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "\",\n                \"scriptType\": \"bash\",\n                \"scriptLocation\": \"inlineScript\",\n                \"inlineScript\": \"az storage blob upload-batch --destination '$web/v/$(deploymentPath)' --source . --account-name $(storageAccountName) --overwrite true\",\n                \"addSpnToEnvironment\": \"false\",\n                \"useGlobalConfig\": \"false\",\n                \"cwd\": \"$(System.DefaultWorkingDirectory)/"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n                \"failOnStandardError\": \"false\",\n                \"visibleAzLogin\": \"true\"\n              }\n            }"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,(depth0 != null ? lookupProperty(depth0,"preserveFiles") : depth0),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":218,"column":13},"end":{"line":245,"column":20}}})) != null ? stack1 : "")
    + "\n\n          ]\n        }\n      ],\n      \"environmentOptions\": {\n        \"emailNotificationType\": \"OnlyOnFailure\",\n        \"emailRecipients\": \"release.environment.owner;release.creator\",\n        \"skipArtifactsDownload\": false,\n        \"timeoutInMinutes\": 0,\n        \"enableAccessToken\": false,\n        \"publishDeploymentStatus\": true,\n        \"badgeEnabled\": false,\n        \"autoLinkWorkItems\": false,\n        \"pullRequestDeploymentEnabled\": false\n      },\n      \"demands\": [],\n      \"conditions\": [\n        {\n          \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n          \"conditionType\": 8,\n          \"value\": \"\"\n        }\n      ],\n      \"executionPolicy\": {\n        \"concurrencyCount\": 1,\n        \"queueDepthCount\": 0\n      },\n      \"schedules\": [],\n      \"retentionPolicy\": {\n        \"daysToKeep\": 30,\n        \"releasesToKeep\": 3,\n        \"retainBuild\": true\n      },\n      \"processParameters\": {},\n      \"properties\": {}\n    }\n  ],\n  \"artifacts\": [\n    {\n      \"sourceId\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + ":"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n      \"type\": \"Build\",\n      \"alias\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n      \"definitionReference\": {\n        \"artifactSourceDefinitionUrl\": {\n          \"id\": \"\",\n          \"name\": \"\"\n        },\n        \"defaultVersionType\": {\n          \"id\": \"latestType\",\n          \"name\": \"Latest\"\n        },\n        \"definition\": {\n          \"id\": \"\",\n          \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\"\n        },\n        \"project\": {\n          \"id\": \"\",\n          \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + "\"\n        }\n      },\n      \"isPrimary\": true,\n      \"isRetained\": false\n    }\n  ],\n  \"triggers\": [\n    {\n      \"artifactAlias\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n      \"triggerConditions\": [],\n      \"triggerType\": 1\n    }\n  ],\n  \"releaseNameFormat\": \"Release-$(rev:r)\",\n  \"tags\": [],\n  \"properties\": {}\n}\n";
},"useData":true}),
  "release-swa.json.hbs": Handlebars.template({"0":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ",\n\n            {\n              \"taskId\": \"9c3e8943-130d-4c78-ac63-8af81df62dfb\",\n              \"version\": \"0.*\",\n              \"name\": \"Trigger downstream pipeline\",\n              \"refName\": \"TriggerDownstreamPipeline\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"waitForCompletion\": \"false\",\n                \"buildDefinition\": \""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"triggerPipelineId") : stack1), depth0))
    + "\",\n                \"queueBuildForUserThatTriggeredBuild\": \"true\",\n                \"ignoreSslCertificateErrors\": \"false\",\n                \"useSameSourceVersion\": \"false\",\n                \"useCustomSourceVersion\": \"false\",\n                \"buildParameters\": \"\",\n                \"storeInEnvironment\": \"false\",\n                \"authenticationMethod\": \"OAuth Token\",\n                \"password\": \"$(System.AccessToken)\",\n                \"enableSecureParameters\": \"false\"\n              }\n            }";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : (container.nullContext || {}), alias4=container.hooks.helperMissing, alias5="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  \"id\": -1,\n  \"name\": \"RELEASE-"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n  \"type\": 1,\n  \"quality\": 1,\n  \"path\": \"\\\\\",\n  \"createdOn\": \""
    + alias2(((helper = (helper = lookupProperty(helpers,"generatedAt") || (depth0 != null ? lookupProperty(depth0,"generatedAt") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"generatedAt","hash":{},"data":data,"loc":{"start":{"line":7,"column":16},"end":{"line":7,"column":31}}}) : helper)))
    + "\",\n  \"project\": {\n    \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + "\"\n  },\n  \"variables\": {\n    \"swaDeploymentToken\": {\n      \"value\": \""
    + alias2(((helper = (helper = lookupProperty(helpers,"swaDeploymentToken") || (depth0 != null ? lookupProperty(depth0,"swaDeploymentToken") : depth0)) != null ? helper : alias4),(typeof helper === alias5 ? helper.call(alias3,{"name":"swaDeploymentToken","hash":{},"data":data,"loc":{"start":{"line":13,"column":16},"end":{"line":13,"column":38}}}) : helper)))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": true\n    },\n    \"deploymentPath\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"deploymentPath") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    },\n    \"projectName\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"projectName") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    },\n    \"serviceConnectionId\": {\n      \"value\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"serviceConnectionId") : stack1), depth0))
    + "\",\n      \"allowOverride\": false,\n      \"isSecret\": false\n    }\n  },\n  \"variableGroups\": [],\n  \"environments\": [\n    {\n      \"id\": 1,\n      \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"environment") : stack1), depth0))
    + "\",\n      \"rank\": 1,\n      \"owner\": {\n        \"displayName\": \"PipeForge\"\n      },\n      \"variables\": {},\n      \"variableGroups\": [],\n      \"preDeployApprovals\": {\n        \"approvals\": [\n          {\n            \"rank\": 1,\n            \"isAutomated\": true,\n            \"isNotificationOn\": false\n          }\n        ],\n        \"approvalOptions\": {\n          \"requiredApproverCount\": null,\n          \"releaseCreatorCanBeApprover\": false,\n          \"autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped\": false,\n          \"enforceIdentityRevalidation\": false,\n          \"timeoutInMinutes\": 0,\n          \"executionOrder\": 1\n        }\n      },\n      \"postDeployApprovals\": {\n        \"approvals\": [\n          {\n            \"rank\": 1,\n            \"isAutomated\": true,\n            \"isNotificationOn\": false\n          }\n        ],\n        \"approvalOptions\": {\n          \"requiredApproverCount\": null,\n          \"releaseCreatorCanBeApprover\": false,\n          \"autoTriggeredAndPreviousEnvironmentApprovedCanBeSkipped\": false,\n          \"enforceIdentityRevalidation\": false,\n          \"timeoutInMinutes\": 0,\n          \"executionOrder\": 2\n        }\n      },\n      \"deployPhases\": [\n        {\n          \"deploymentInput\": {\n            \"parallelExecution\": {\n              \"parallelExecutionType\": 0\n            },\n            \"agentSpecification\": {\n              \"identifier\": \"ubuntu-latest\"\n            },\n            \"skipArtifactsDownload\": false,\n            \"artifactsDownloadInput\": {\n              \"downloadInputs\": [\n                {\n                  \"artifactItems\": [],\n                  \"alias\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n                  \"artifactType\": \"Build\",\n                  \"artifactDownloadMode\": \"All\"\n                }\n              ]\n            },\n            \"queueId\": 0,\n            \"demands\": [],\n            \"enableAccessToken\": false,\n            \"timeoutInMinutes\": 0,\n            \"jobCancelTimeoutInMinutes\": 1,\n            \"condition\": \"succeeded()\",\n            \"overrideInputs\": {}\n          },\n          \"rank\": 1,\n          \"phaseType\": 1,\n          \"name\": \"Agent job\",\n          \"refName\": \"Job_1\",\n          \"workflowTasks\": [\n\n            {\n              \"taskId\": \"d9bafed4-0b18-4f58-968d-86655b4d2ce9\",\n              \"version\": \"2.*\",\n              \"name\": \"Install @azure/static-web-apps-cli\",\n              \"refName\": \"InstallSwaCli\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"script\": \"npm install -g @azure/static-web-apps-cli\",\n                \"workingDirectory\": \"\",\n                \"failOnStderr\": \"false\"\n              }\n            },\n\n            {\n              \"taskId\": \"d9bafed4-0b18-4f58-968d-86655b4d2ce9\",\n              \"version\": \"2.*\",\n              \"name\": \"SWA Deploy — "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n              \"refName\": \"SWA_Deploy\",\n              \"enabled\": true,\n              \"alwaysRun\": false,\n              \"continueOnError\": false,\n              \"timeoutInMinutes\": 0,\n              \"retryCountOnTaskFailure\": 0,\n              \"definitionType\": \"task\",\n              \"overrideInputs\": {},\n              \"condition\": \"succeeded()\",\n              \"inputs\": {\n                \"script\": \"swa deploy . --deployment-token $(swaDeploymentToken) --env "
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"environment") : stack1), depth0))
    + " --no-use-keychain\",\n                \"workingDirectory\": \"$(System.DefaultWorkingDirectory)/"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n                \"failOnStderr\": \"false\"\n              }\n            }"
    + ((stack1 = lookupProperty(helpers,"if").call(alias3,((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"triggerPipelineAfterDeploy") : stack1),{"name":"if","hash":{},"fn":container.program(0, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":152,"column":13},"end":{"line":181,"column":20}}})) != null ? stack1 : "")
    + "\n\n          ]\n        }\n      ],\n      \"environmentOptions\": {\n        \"emailNotificationType\": \"OnlyOnFailure\",\n        \"emailRecipients\": \"release.environment.owner;release.creator\",\n        \"skipArtifactsDownload\": false,\n        \"timeoutInMinutes\": 0,\n        \"enableAccessToken\": false,\n        \"publishDeploymentStatus\": true,\n        \"badgeEnabled\": false,\n        \"autoLinkWorkItems\": false,\n        \"pullRequestDeploymentEnabled\": false\n      },\n      \"demands\": [],\n      \"conditions\": [\n        {\n          \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n          \"conditionType\": 8,\n          \"value\": \"\"\n        }\n      ],\n      \"executionPolicy\": {\n        \"concurrencyCount\": 1,\n        \"queueDepthCount\": 0\n      },\n      \"schedules\": [],\n      \"retentionPolicy\": {\n        \"daysToKeep\": 30,\n        \"releasesToKeep\": 3,\n        \"retainBuild\": true\n      },\n      \"processParameters\": {},\n      \"properties\": {}\n    }\n  ],\n  \"artifacts\": [\n    {\n      \"sourceId\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + ":"
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\",\n      \"type\": \"Build\",\n      \"alias\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n      \"definitionReference\": {\n        \"artifactSourceDefinitionUrl\": {\n          \"id\": \"\",\n          \"name\": \"\"\n        },\n        \"defaultVersionType\": {\n          \"id\": \"latestType\",\n          \"name\": \"Latest\"\n        },\n        \"definition\": {\n          \"id\": \"\",\n          \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"pipelineName") : stack1), depth0))
    + "\"\n        },\n        \"project\": {\n          \"id\": \"\",\n          \"name\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"adoProjectName") : stack1), depth0))
    + "\"\n        }\n      },\n      \"isPrimary\": true,\n      \"isRetained\": false\n    }\n  ],\n  \"triggers\": [\n    {\n      \"artifactAlias\": \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"combination") : depth0)) != null ? lookupProperty(stack1,"artifactAlias") : stack1), depth0))
    + "\",\n      \"triggerConditions\": [],\n      \"triggerType\": 1\n    }\n  ],\n  \"releaseNameFormat\": \"Release-$(rev:r)\",\n  \"tags\": [],\n  \"properties\": {}\n}\n";
},"useData":true}),
};
