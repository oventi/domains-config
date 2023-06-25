import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

const is_array = o => Array.isArray(o)
const is_object = o => !is_array(o) && o instanceof Object
const is_document = o => is_object(o) && o.nodeType && o.nodeType === 'document'

// https://github.com/contentful/rich-text/issues/61#issue-399666643
const documentToHtmlStringOptions = {
  renderNode: {
    'embedded-asset-block': (node) =>
      `<img
        class="img-fluid float-left mr-3 mb-3"
        src="${node.data.target.fields.file.url}"
        alt="${node.data.target.fields.title}"
      />`
  }
}

export function prepare(data) {
  const { sys, fields } = data
  if (!sys && !fields) { return data }

  const prepared_data = {}
  const properties = fields || data

  for (const property in properties) {
    const part = properties[property]
    let prepared = part

    if (is_document(part)) {
      prepared = documentToHtmlString(part, documentToHtmlStringOptions)
    }

    if (is_object(part) && !is_document(part)) {
      prepared = prepare(part)
    }

    if (is_array(part)) {
      prepared = part.map(p => prepare(p))
    }

    prepared_data[property] = prepared
  }

  return {
    content_type: sys && sys.contentType ? sys.contentType.sys.id : null,
    ...prepared_data
  }
}
