import { Router, Request, Response } from 'express'
import qs from 'qs'
import {
    getMdblistManifest,
    mdblistListCatalogHandler,
} from './mdblist-manifest.js'
import { Args, ContentType } from 'stremio-addon-sdk'

export function attachMdblistRoutes(router: Router) {
    router.get(
        '/:listIds/:mdbListKey/:myshowsUsername?/manifest.json',
        async (req: Request, res: Response) => {
            const listIds = (req.params.listIds || '').split(',')
            if (!listIds.length) {
                res.status(500).send('Invalid mDBList list IDs')
                return
            }

            let username: string | undefined
            let listname: string | undefined
            let listId: string | undefined
            if (listIds.length === 1) {
                listId = listIds[0]
            } else if (listIds.length === 2) {
                username = listIds[0]
                listname = listIds[1]
            } else {
                res.status(500).send('Invalid mDBList list IDs')
                return
            }

            const mdbListKey = req.params.mdbListKey
            if (!mdbListKey) {
                res.status(500).send('Invalid mDBList Key')
                return
            }

            try {
                const manifest = await getMdblistManifest(
                    mdbListKey,
                    listId,
                    username,
                    listname
                )
                res.json(manifest)
            } catch (error) {
                res.status(500).send('Error fetching manifest')
            }
        }
    )

    router.get(
        '/:listIds/:mdbListKey/:myshowsUsername?/catalog/:type/:slug/:extra?.json',
        async (req, res) => {
            const listIds = (req.params.listIds || '').split(',')
            if (!listIds.length) {
                res.status(500).send('Invalid mDBList list IDs')
                return
            }

            let username: string | undefined
            let listname: string | undefined
            let listId: string | undefined
            if (listIds.length === 1) {
                listId = listIds[0]
            } else if (listIds.length === 2) {
                username = listIds[0]
                listname = listIds[1]
            } else {
                res.status(500).send('Invalid mDBList list IDs')
                return
            }

            const mdbListKey = req.params.mdbListKey
            if (!mdbListKey) {
                res.status(500).send('Invalid mDBList Key')
                return
            }
            const extra = req.params.extra
                ? qs.parse(req?.url.split('/').pop()!.slice(0, -5))
                : {}
            const skip = parseInt((extra.skip as string) || '0')
            const type = req.params.type as ContentType

            if (type !== 'series') {
                res.status(500).send('Only series catalogs are supported')
                return
            }

            try {
                const args = {
                    extra: { skip, genre: extra.genre },
                    type,
                    id: req.params.slug,
                } as Args
                const { metas } = await mdblistListCatalogHandler(
                    args,
                    mdbListKey,
                    req.params.myshowsUsername,
                    listId,
                    username,
                    listname,
                )

                res.json({
                    metas,
                })
            } catch (error) {
                res.status(500).send('Error fetching catalog')
            }
        }
    )
}
