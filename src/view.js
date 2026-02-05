export default (elements, state, i18nextInstance) => {
    elements.buttonAddUrl.disabled = state.formRss.isValid
    elements.inputUrl.readOnly = state.formRss.isValid

    console.log(elements.feedback)

    if (state.formRss.isValid) {
        elements.inputUrl.value = ''
        elements.inputUrl.focus()
        elements.inputUrl.classList.remove('is-invalid')
        elements.feedback.textContent = ''
    }
    if (!state.formRss.isValid) {
        elements.inputUrl.classList.add('is-invalid')
        elements.feedback.textContent = `${state.formRss.error}`
    }
}