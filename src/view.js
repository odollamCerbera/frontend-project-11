const createFeeds = (state, i18nextInstance) => {
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

    state.data.feeds.forEach((feed) => {
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
        ul.append(li)
    })
    container.append(div, ul)
    return container
}

const createPosts = (state, i18nextInstance) => {
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

    state.data.posts.forEach((post) => {
        const { id, postLink, postTitle } = post

        const li = document.createElement('li')
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

        const a = document.createElement('a')
        a.classList.add('fw-bold') // Будет меняться в зависимости от просмотра
        a.setAttribute('href', postLink)
        a.setAttribute('data-id', id)
        a.setAttribute('target', '_blank')
        a.setAttribute('rel', 'noopener noreferrer')
        a.textContent = postTitle

        const button = document.createElement('button')
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
        button.setAttribute('type', 'button')
        button.setAttribute('data-id', id)
        button.setAttribute('data-bs-toggle', 'modal')
        button.setAttribute('data-bs-target', '#modal')
        button.textContent = i18nextInstance.t('viewing')

        li.append(a, button)
        ul.append(li)
    })
    container.append(div, ul)
    return container
}

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

            elements.feeds.append(createFeeds(state, i18nextInstance))
            elements.posts.append(createPosts(state, i18nextInstance))

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
            elements.feedback.classList.add('text-danger')
            elements.feedback.classList.remove('text-success')
            break
        }
        default:
            break
    }
}

const handleError = (elements, state) => {
    elements.feedback.textContent = state.formRss.error || state.loadingProcess.error
}

export default (elements, state, i18nextInstance) => (path, value) => {
    console.log('path', path, 'value', value)
    switch (path) {
        case 'formRss.error':
            handleError(elements, state)
            break
        case 'loadingProcess.error':
            handleError(elements, state)
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
        default:
            break
    }
}
