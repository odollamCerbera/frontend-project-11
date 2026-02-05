import './styles.scss'
import 'bootstrap'
import * as yup from 'yup'
import onChange from 'on-change'
import i18next from 'i18next'
import resources from './locales.js'
import render from './view.js'

const defaultLocale = 'ru'

const elements = {
  formRss: document.querySelector('.rss-form'),
  inputUrl: document.querySelector('#url-input'),
  buttonAddUrl: document.querySelector('[aria-label="add"]'),
  feedback: document.querySelector('.feedback'),
  posts: document.querySelector('.posts'),
  feeds: document.querySelector('.feeds'),
}

const state = {
  formRss: {
    stateForm: 'filling', // 'processing', 'failed', 'success'
    currentUrl: '',
    isValid: true,
    error: '',
  },
  loadingProcess: {
    status: 'initializing', // 'loading', 'failed', 'success'
    errors: [],
  },
  data: {
    posts: [],
    feeds: [],
    links: [],
  },
}

const i18nextInstance = i18next.createInstance()
i18nextInstance.init({
  lng: defaultLocale,
  debug: true,
  resources,
})
  .then(() => {
    yup.setLocale({
      mixed: {
        required: i18nextInstance.t('isEmpty'),
        notOneOf: i18nextInstance.t('isAlreadyExists'),
      },
      string: {
        url: i18nextInstance.t('isInvalidUrl'),
      }
    })
  })

const createSchema = (urls) => yup.object().shape({
  currentUrl: yup
    .string().trim()
    .url()
    .required()
    .notOneOf(urls)
})

const watchedState = onChange(state, function (path, value, previousValue) {
  render(elements, state, i18nextInstance)
})

elements.formRss.addEventListener('submit', (event) => {
  event.preventDefault()
  const url = elements.inputUrl.value

  const schema = createSchema(watchedState.data.links)
  schema
    .validate({ currentUrl: url })
    .then(({ currentUrl }) => {
      watchedState.formRss = {
        stateForm: 'success',
        currentUrl: currentUrl,
        isValid: true,
        error: '',
      }
      watchedState.data.links.push(currentUrl)
    })
    .catch((error) => {
      console.log(error)
      watchedState.formRss = {
        stateForm: 'failed',
        currentUrl: '',
        isValid: false,
        error: error.message,
      }
    })
})
