declare module 'translit' {
    type TranslitMap = {
        [key: string]: string
    }

    type TranslitFunction = (text: string) => string

    function translit(map: TranslitMap): TranslitFunction

    export default translit
}

declare module 'translit-russian' {
    const map: {
        [key: string]: string
    }

    export default map
}
