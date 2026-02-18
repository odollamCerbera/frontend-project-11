import createFeeds from './feeds'
import createPosts from './posts'

const handleProcessForm = (elements, state) => {
  switch (state.formRss.stateForm) {
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
      elements.feedback.textContent = `${state.formRss.error}`
      break
    }
    default:
      break
  }
}

const handleLoadingProcess = (elements, state, i18nextInstance) => {
  switch (state.loadingProcess.status) {
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

      elements.feeds.textContent = ''
      elements.posts.textContent = ''

      elements.feeds.append(createFeeds(state.data.feeds, i18nextInstance))
      elements.posts.append(createPosts(state.data.posts, state.uiState.visitedPosts, i18nextInstance))

      elements.feedback.textContent = i18nextInstance.t('successRss')

      elements.feedback.classList.remove('text-danger')
      elements.feedback.classList.add('text-success')
      break
    }
    case 'failed': {
      elements.buttonAddUrl.disabled = false
      elements.inputUrl.readOnly = false

      elements.feedback.textContent = `${state.loadingProcess.error}`
      elements.inputUrl.classList.add('is-invalid')
      elements.feedback.classList.remove('text-success')
      elements.feedback.classList.add('text-danger')
      break
    }
    default:
      break
  }
}

const handleError = (element, error) => element.textContent = error

const handleModal = (elements, posts, postId) => {
  const currentPost = posts.find(post => post.id === postId)
  const { postTitle, postDescription, postLink } = currentPost
  elements.modalTitle.textContent = postTitle
  elements.modalBody.textContent = postDescription
  elements.buttonPrimary.setAttribute('href', postLink)
}

export default (elements, state, i18nextInstance) => (path, value) => {
  console.log('path', path, 'value', value)
  switch (path) {
    case 'formRss.error':
    case 'loadingProcess.error':
      handleError(element.feedback, value)
      break
    case 'formRss.stateForm':
      handleProcessForm(elements, state)
      break
    case 'loadingProcess.status':
      handleLoadingProcess(elements, state, i18nextInstance)
      break
    case 'data.posts':
      handleLoadingProcess(elements, state, i18nextInstance)
      break
    case 'uiState.visitedPosts':
      handleLoadingProcess(elements, state, i18nextInstance)
      break
    case 'uiState.currentVisitedPost':
      handleModal(elements, state.data.posts, value)
      break
    default:
      break
  }
}
