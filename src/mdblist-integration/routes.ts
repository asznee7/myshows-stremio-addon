import { Router, Request, Response } from 'express'
import qs from 'qs'
import {
    getMdblistManifest,
    mdblistListCatalogHandler,
} from './mdblist-manifest'
import { Args, ContentType } from 'stremio-addon-sdk'

export function attachMdblistRoutes(router: Router) {
    router.get(
        '/:listIds/:mdbListKey/:myshowsUsername?/manifest.json',
        async (req: Request, res: Response) => {
            const listIds = (req.params.listIds || '').split(',')
            if (!listIds.length || listIds.length > 1) {
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
                    listIds[0],
                    mdbListKey
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
            if (!listIds.length || listIds.length > 1) {
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
                    listIds[0],
                    mdbListKey,
                    req.params.myshowsUsername
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
