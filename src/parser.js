export default (data) => {
  const parser = new DOMParser()
  const parsedData = parser.parseFromString(data, 'application/xml')

  const error = parsedData.querySelector('parsererror')
  if (error) {
    throw new Error('Parser error')
  }

  const channel = parsedData.querySelector('channel')

  const feed = {
    feedTitle: channel.querySelector('title').textContent,
    feedDescription: channel.querySelector('description').textContent,
    feedLink: channel.querySelector('link').textContent,
  }

  const items = parsedData.querySelectorAll('item')

  const posts = [...items].map((item) => ({
    postTitle: item.querySelector('title').textContent,
    postDescription: item.querySelector('description').textContent,
    postLink: item.querySelector('link').textContent,
  }))

  return { feed, posts }
}
