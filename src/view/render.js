import createFeeds from './feeds'
import createPosts from './posts'

const handleProcessForm = (elements, statusProcessForm) => {
  switch (statusProcessForm) {
    case 'processing': {
      elements.buttonAddUrl.disabled = true
      elements.inputUrl.readOnly = true
      break
    }
    case 'success': {
      elements.buttonAddUrl.disabled = false
      elements.inputUrl.readOnly = false
      elements.feedback.textContent = ''
      break
    }
    case 'failed': {
      elements.buttonAddUrl.disabled = false
      elements.inputUrl.readOnly = false
      elements.inputUrl.classList.add('is-invalid')
      break
    }
    default:
      break
  }
}

const handleLoadingProcess = (elements, statusLoadingProcess, i18nextInstance) => {
  switch (statusLoadingProcess) {
    case 'loading': {
      elements.buttonAddUrl.disabled = true
      elements.inputUrl.readOnly = true
      break
    }
    case 'success': {
      elements.buttonAddUrl.disabled = false
      elements.inputUrl.readOnly = false
      elements.formRss.reset()
      elements.inputUrl.focus()
      elements.inputUrl.classList.remove('is-invalid')

      elements.feedback.textContent = i18nextInstance.t('successRss')
      elements.feedback.classList.remove('text-danger')
      elements.feedback.classList.add('text-success')
      break
    }
    case 'failed': {
      elements.buttonAddUrl.disabled = false
      elements.inputUrl.readOnly = false
      elements.inputUrl.classList.add('is-invalid')
      break
    }
    default:
      break
  }
}

const handleFeeds = (elements, feeds, i18nextInstance) => {
  elements.feeds.textContent = ''
  elements.feeds.append(createFeeds(feeds, i18nextInstance))
}

const handlePosts = (elements, posts, visitedPosts, i18nextInstance) => {
  elements.posts.textContent = ''
  elements.posts.append(createPosts(posts, visitedPosts, i18nextInstance))
}

const handleError = (elements, error) => {
  elements.feedback.textContent = error
  elements.feedback.classList.remove('text-success')
  elements.feedback.classList.add('text-danger')
}

const handleModal = (elements, postId, posts) => {
  const currentPost = posts.find(post => post.id === postId)
  const { postTitle, postDescription, postLink } = currentPost
  elements.modalTitle.textContent = postTitle
  elements.modalBody.textContent = postDescription
  elements.buttonPrimary.setAttribute('href', postLink)
}

export default (elements, state, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'formRss.error':
      handleError(elements, value)
      break
    case 'loadingProcess.error':
      handleError(elements, value)
      break
    case 'formRss.stateForm':
      handleProcessForm(elements, value)
      break
    case 'loadingProcess.status':
      handleLoadingProcess(elements, value, i18nextInstance)
      break
    case 'data.feeds':
      handleFeeds(elements, value, i18nextInstance)
      break
    case 'data.posts':
      handlePosts(elements, value, state.uiState.visitedPosts, i18nextInstance)
      break
    case 'uiState.currentVisitedPost':
      handleModal(elements, value, state.data.posts)
      break
    default:
      break
  }
}
