import fs from 'fs-extra'
import { get_contentful_da } from './contentful'
import mustache from 'mustache'

const { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } = process.env

const contentful = get_contentful_da(CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID)

const templates = {
  layout: fs.readFileSync('./views/layout.mustache', 'utf-8')
}

  ;

(async () => {
  fs.ensureDirSync('.vercel/output/static')

  const data = await contentful.get({ content_type: 'ws_site', 'fields.name': 'clublatino.org.nz' })
  console.log(JSON.stringify(data))
  const { title: site_title, pages, social_media, footer } = data

  for (const page of pages) {
    const { name, title } = page
    const page_data = {
      global: { title: site_title },
      name, title
    }

    fs.writeFileSync(
      `./public/${name}.html`,
      mustache.render(templates.layout, page_data, templates)
    )
  }
})()
