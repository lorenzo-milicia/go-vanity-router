interface Env {
    CUSTOM_DOMAIN: string;
    REPOSITORY_URL: string;
    CUSTOM_ROUTINGS: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    let response = new Response(buildHtml(context))
    response.headers.set("Content-Type", "text/html")
    return response
}

function buildHtml(context: EventContext<Env, any, Record<string, unknown>>): string {
    return `
	<!doctype html>
	<html>
	<head>
	${buildMetaTag(context)}
	${buildRoutingTag(context)}
	</head>
	<body>
	<div>
	<p>You're being redirected to the repository's URL</p>
	</div>
	</body>
	</html>
	`.trim()
}

function buildMetaTag(context: EventContext<Env, any, Record<string, unknown>>): string {
    let vanityPath = context.functionPath
    let customDomain: string = context.env.CUSTOM_DOMAIN
    let repositoryUrl: string = context.env.REPOSITORY_URL
    let customRoutings = getCustomRoutingsFrom(context.env.CUSTOM_ROUTINGS)
    let repositoryPath = routeVanityPath(vanityPath, customRoutings)

    return `<meta name="go-import" content="${customDomain}${vanityPath} git https://${repositoryUrl}${repositoryPath}">`
}

function buildRoutingTag(context: EventContext<Env, any, Record<string, unknown>>): string {
    let vanityPath = context.functionPath
    if (vanityPath == "/") return ""
    let repositoryUrl: string = context.env.REPOSITORY_URL
    let customRoutings = getCustomRoutingsFrom(context.env.CUSTOM_ROUTINGS)
    let repositoryPath = routeVanityPath(vanityPath, customRoutings)

    return `<meta http-equiv="Refresh" content="0; url='https://${repositoryUrl}${repositoryPath}'"/>`
}

function getCustomRoutingsFrom(routingsEnv: string): Map<string, string> {
    let splitString = routingsEnv.split(",")
    let map = new Map()
    for (let i = 0; i < splitString.length / 2; i++) {
        map.set(splitString[i], splitString[i + 1])
    }
    return map
}


function routeVanityPath(vanityPath: string, customRoutings: Map<string, string>): string {
    let repositoryPath = vanityPath
    customRoutings.forEach((value, key) => {
            repositoryPath = repositoryPath.replace(key, value)
        }
    )
    let pathWithoutVersion = removeVersionFromPath(repositoryPath)
    return pathWithoutVersion 
}

function removeVersionFromPath(inputPath: string): string {
  // Use a regular expression to match the final "/vN" pattern
  const regex = /\/v\d+$/;

  // Use the `replace` method to remove the matched pattern
  const updatedPath = inputPath.replace(regex, '');

  return updatedPath;
}

