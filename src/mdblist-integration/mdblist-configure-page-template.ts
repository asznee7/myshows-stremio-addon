import { Manifest } from 'stremio-addon-sdk'

const STYLESHEET = `
.or {
    display: flex;
    align-items: center;
    justify-content: center;
}

.info-box {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1.5rem 0;
    border: 1px solid #e9ecef;
}

.info-box p {
    margin: 0.5rem 0;
}

.info-box ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.info-box a {
    color: #0066cc;
    text-decoration: none;
}

.info-box a:hover {
    text-decoration: underline;
}
`

export function mdblistConfigurePageTemplate(manifest: Manifest) {
    const logo = manifest.logo || 'https://dl.strem.io/addon-logo.png'

    const script = `
    installLink.onclick = () => {
        return mainForm.reportValidity()
    }

    const updateLink = () => {
        const formData = new FormData(mainForm)
        const username = formData.get('username')
        const listname = formData.get('listname')
        const listid = formData.get('listid')
        const apikey = formData.get('apikey')
        const myshowsUsername = formData.get('myshowsUsername')

        let configPath
        if (listid && listid.toString().trim() !== '') {
            configPath = \`\${listid}/\${apikey}/\${myshowsUsername}\`
        } else if (username && listname && 
            username.toString().trim() !== '' && 
            listname.toString().trim() !== '') {
            configPath = \`\${username},\${listname}/\${apikey}/\${myshowsUsername}\`
        }

        installLink.href = 'stremio://' + window.location.host + '/' + configPath + '/manifest.json'
    }
    mainForm.onchange = updateLink
    `

    return `
	<!DOCTYPE html>
	<html>

	<head>
		<meta charset="utf-8">
		<title>${manifest.name} - Stremio Addon</title>
		<link rel="shortcut icon" href="${logo}" type="image/x-icon">
		<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap" rel="stylesheet">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/purecss@2.1.0/build/pure-min.css" integrity="sha384-yHIFVG6ClnONEA5yB5DJXfW2/KC173DIQrYoZMEtBvGzmf0PKiGyNEqe9N6BNDBH" crossorigin="anonymous">
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        >
        <style>${STYLESHEET}</style>
	</head>

	<body>
		<main class="container">
			<div>
			<img src="${logo}">
			</div>
			<h1>${manifest.name}</h1>
			<h2>v${manifest.version || '0.0.0'}</h2>
			<h2>${manifest.description || ''}</h2>

            <div class="info-box">
                <p>This addon allows you to integrate your MDBList with Stremio, filtering out shows you've already watched on MyShows.</p>
                <p>To get started:</p>
                <ol>
                    <li>Get your MDBList API key from <a href="https://mdblist.com/settings/api" target="_blank">MDBList API Settings</a></li>
                    <li>Enter either your MDBList username and list name, or directly use a list ID</li>
                    <li>Enter your MyShows username to filter out watched shows</li>
                </ol>
            </div>

            <form id="mainForm">
                <div class="grid">
                    <div class="form-element">
                        <div>MDBList Username</div>
                        <input type="text" id="username" name="username"/>
                    </div>
                    <div class="form-element">
                        <div>MDBList List Name</div>
                        <input type="text" id="listname" name="listname"/>
                    </div>
                    <div class="or">OR</div>
                    <div class="form-element"> 
                        <div>MDBList List ID</div>
                        <input type="text" id="listid" name="listid"/>
                    </div>
                </div>
                
                <div class="form-element">
                    <div>MDBList API Key</div>
                    <input type="text" id="apikey" name="apikey"required />
                </div>
                <div class="form-element">
                    <div>MyShows Username</div>
                    <input type="text" id="myshowsUsername" name="myshowsUsername"required />
                </div>
            </form>

			<a id="installLink" href="#">
			<button name="Install">INSTALL</button>
			</a>
		</main>
		<script>
			${script}

			if (typeof updateLink === 'function')
			updateLink()
			else
			installLink.href = 'stremio://' + window.location.host + '/manifest.json'
		</script>
	</body>

	</html>`
}
