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
            elements.formRss.reset()
            elements.inputUrl.focus()
            elements.inputUrl.classList.remove('is-invalid')
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

export default (elements, state, i18nextInstance) => {
    handleProcessForm(elements, state)
}
