const createFeed = (feed) => {
  const { feedTitle, feedDescription } = feed

  const li = document.createElement('li')
  li.classList.add('list-group-item', 'border-0', 'border-end-0')

  const h3 = document.createElement('h3')
  h3.classList.add('h6', 'm-0')
  h3.textContent = feedTitle

  const p = document.createElement('p')
  p.classList.add('m-0', 'small', 'text-black-50')
  p.textContent = feedDescription

  li.append(h3, p)

  return li
}

const createFeedsContainer = (feeds, i18nextInstance) => {
  const container = document.createElement('div')
  container.classList.add('card', 'border-0')

  const div = document.createElement('div')
  div.classList.add('card-body')

  const h2 = document.createElement('h2')
  h2.classList.add('card-title', 'h4')
  h2.textContent = i18nextInstance.t('feeds')

  div.append(h2)

  const ul = document.createElement('ul')
  ul.classList.add('list-group', 'border-0', 'rounded-0')

  feeds.forEach(feed => ul.append(createFeed(feed)))

  container.append(div, ul)

  return container
}

export default createFeedsContainer
