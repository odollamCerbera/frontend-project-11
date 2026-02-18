const createPost = (post, visitedPosts, i18nextInstance) => {
  const { id, postLink, postTitle } = post

  const li = document.createElement('li')
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

  const a = document.createElement('a')

  a.classList.add(visitedPosts.has(id) ? 'fw-normal' : 'fw-bold')
  a.style = visitedPosts.has(id) ? 'color: #6c757d' : 'color: #06EFD'
  a.setAttribute('href', postLink)
  a.setAttribute('target', '_blank')
  a.setAttribute('rel', 'noopener noreferrer')
  a.dataset.id = id
  a.textContent = postTitle

  const button = document.createElement('button')
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
  button.setAttribute('type', 'button')
  button.dataset.bsToggle = 'modal'
  button.dataset.bsTarget = '#modal'
  button.dataset.id = id
  button.textContent = i18nextInstance.t('viewing')

  li.append(a, button)
  return li
}

const createPostsContainer = (posts, visitedPosts, i18nextInstance) => {
  const container = document.createElement('div')
  container.classList.add('card', 'border-0')

  const div = document.createElement('div')
  div.classList.add('card-body')

  const h2 = document.createElement('h2')
  h2.classList.add('card-title', 'h4')
  h2.textContent = i18nextInstance.t('posts')

  div.append(h2)

  const ul = document.createElement('ul')
  ul.classList.add('list-group', 'border-0', 'rounded-0')

  posts.forEach(post => ul.append(createPost(post, visitedPosts, i18nextInstance)))

  container.append(div, ul)
  return container
}

export default createPostsContainer
